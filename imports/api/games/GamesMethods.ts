import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { GamesCollection, GamesCollectionSchema } from './GamesCollection';
import type { GameType, PlayerType } from '../types'
import { shuffleArray } from '/imports/helpers/shuffle';
import { CardsCollection } from '../cards/CardsCollection';
import type { CardType } from '../types';
import { getPlayerToRender } from '/imports/helpers/gameplay';
import { fullName } from '/imports/helpers/reducers';

const allPlayersReady = (game: GameType) => {
	if (game.isDemo) return true;
	return game.players.reduce((accumulator, player) => {
		return accumulator && player.ready;
	}, true as boolean);
};

const allPlayersReadyForEndGame = (game: GameType) => {
	const roundIsFinal = game.round === game.players.length -1;
	const allPlayersInFinalRound = game.players.every((player) => player.round === game.players.length -1);
	if (game.isDemo && roundIsFinal) return true;

	return roundIsFinal && allPlayersReady(game) && allPlayersInFinalRound
}

const advanceToGameSummary = async (game: GameType) => {
	const update = {
		$set: {
			completed: true
		},
	};

	const response = await GamesCollection.updateAsync(game._id, update);
	if (response) {
		return { 
			endGame: true
		 };
	}
}

const getGameResults = async (game: GameType) => {
	const players = game.players;
	const totals = players.map((player) => {
		const totalAttempts = player.results.reduce((accumulator: number, round: any) => {
			accumulator = accumulator + round.attempts
			return accumulator
		}, 0);
		const totalScore = player.results.reduce((accumulator: number, round: any) => {
			return accumulator + round.score
		}, 0);
		const bonusScores = player.results.filter((result: any) => result.score === 6).length;

		return {
			playerId: player._id,
			totalAttempts: totalAttempts,
			totalScore: totalScore,
			bonusScores: bonusScores
		}
	})

	const response = await Promise.all(players.map( async (player) => {
		const profile = await Meteor.users.findOneAsync(player._id);
		const name = fullName(profile)
		return {
			_id: player._id,
			name: name,
			cogBonus: player.cogBonus,
			totalAttempts: totals.find((total) => total.playerId === player._id)?.totalAttempts ?? 0,
			totalScore: totals.find((total) => total.playerId === player._id)?.totalScore ?? 0,
			bonusScores: totals.find((total) => total.playerId === player._id)?.bonusScores ?? 0,
			results: player.results
		}
	}));

	return response
};

const regulateCardsRotation = (cards: CardType[]) => {
	return cards.map((card) => {
		const rotation = card.rotation ?? 0;
		if (rotation > 0) { card.rotation = rotation }
		else if (rotation === -0.25) { card.rotation = 0.75}
		else if (rotation === -0.5) { card.rotation = 0.5} 
		else if (rotation === -0.75) { card.rotation = 0.25 } 
		else { card.rotation = 0 }
		return card
	})
}

const incrementAttempt = async (game: GameType, playerId: string) => {
	const player = game.players.find((player: PlayerType) => player._id === playerId);
	const previousAttempts = player.results.find((result: any) => result.round === player.round)?.attempts ?? 0;
	if (previousAttempts > 1) return 2;

	let update = {};
	let options: any = {
		arrayFilters: [
			{ "player._id": playerId },
		]
	};

	if (previousAttempts === 0) {
		update = {
			$addToSet: {
				"players.$[player].results": {
					round: player.round,
					attempts: 1,
					score: 0,
				}
			}
		}
	} else if (previousAttempts === 1) {
		update = {
			$set: {
				"players.$[player].results.$[result].attempts": previousAttempts + 1
			}
		};

		options.arrayFilters.push({ "result.round": player.round })
	}
	
	return await GamesCollection.updateAsync(game._id, update, options)

}

const calculateRoundScore = (game: GameType, playerId: string, incorrectPositions: number) => {
	const player = game.players.find((player: PlayerType) => player._id === playerId);
	const attempts = player.results?.find((result: any) => result.round === player.round)?.attempts ?? 0;
	let score = 0;
	if (incorrectPositions === 2) {
		score = score + 1;
	} else if (incorrectPositions === 1) {
		score = score + 2;
	} else if (incorrectPositions === 0) {
		score = score + 4;
	}

	// bonus score for first attempt
	if (attempts === 0) {
		score = score + 2;
	}

	return score
}

const finalizePlayerRound = async (game: GameType, playerId: string, attempts: number, score: number) => {

	const update = {
		$set: {
			"players.$[player].ready": true,
			"players.$[player].results.$[result].score": score,
			"players.$[player].results.$[result].attempts": attempts,
		}
	};

	const options: any = {
		arrayFilters: [
			{ "player._id": playerId },
			{ "result.round": game.round },
		]
	};

	return await GamesCollection.updateAsync(game._id, update, options)
	
};

const resetDemoGame = async (gameId: string, playerId: string) => {
	const update = {
		$set: {
			started: true,
			completed: false,
			round: 0,
			"players.$[player].ready": false,
			"players.$[player].round": 0,
			"players.$[player].keys": ["", "", "", ""],
			"players.$[player].cogBonus": 0,
			"players.$[player].cards.$[].position": 5,
			"players.$[player].cards.$[].rotation": 0,
			"players.$[player].results": []
		}
	}

	const options = {
		arrayFilters: [
			{ "player._id": playerId },
		]
	}

	return await GamesCollection.updateAsync(gameId, update, options);
}

const incrementCogBonus = async (game: GameType, coplayerId: string) => {
	const update = {
		$inc: {
			"players.$[player].cogBonus": 1,
		}
	}

	const options = {
		arrayFilters: [
			{ "player._id": coplayerId },
		]
	}

	return await GamesCollection.updateAsync(game._id, update, options);
}

Meteor.methods({
	async 'games.insert'(hostId: string) {
		check(hostId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = {
			hostId: Meteor.userId(),
			round: 0,
			started: false,
			completed: false,
			isDemo: false,
			cards: [],
			players: [
				{
					_id: hostId,
					ready: false,
					round: 0,
					cogBonus: 0,
					keys: ["", "", "", ""],
					cards: [],
					results: []
				}
			],
			createdAt: new Date().valueOf(),
		};

		const cleanDoc = GamesCollectionSchema.clean(game);
		GamesCollectionSchema.validate(cleanDoc);
		if (GamesCollectionSchema.isValid()) {
			const gameId = GamesCollection.insertAsync(cleanDoc);
			return gameId;
		} else {
			console.log("invalid game", game, GamesCollectionSchema.validationErrors())
		}
	},

	async 'game.get'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		if (game) {
			return game;
		} else {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}
	},

	async 'game.complete'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		if (game) {
			const update = {
				$set: {
					completed: true
				}
			}
			const response = await GamesCollection.updateAsync(gameId, update);
			if (response === 1) {
				game.completed = true
				return game;
			} else {
				throw new Meteor.Error('unable-to-complete-game', 'An error occurred.  Please try again.');
			}
		} else {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}
	},

	async 'game.start'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});

		if (game?.completed) {
			throw new Meteor.Error('game-already-completed', 'Game has already been completed.  Please try again.');
		}

		if (game?.started) {
			return game;
		}

		const playerCount = game?.players.length || 0;
		
		if (playerCount < 2) {
			throw new Meteor.Error('not-enough-players', 'There must be at least 2 players.  Please try again.');
		}

		const allCards = await CardsCollection.find({}).fetchAsync();
		const gameCardsCount = playerCount * 5;
		const randomIndexes = shuffleArray(Array.from(Array(allCards.length).keys())).slice(0, gameCardsCount);
		const startingCardData = randomIndexes.map((value) => {
			let card = allCards[value as number];
			card.position = 5;
			return card;
		});

		if (game) {			
			game.cards = startingCardData
			game.players.map((player: PlayerType, index: number) => {
				player.cards = startingCardData.slice(index * 5, (index + 1) * 5);
			})
			const update = {
				$set: {
					cards: startingCardData,
					players: game.players,
					started: true,
				}
			}

			const response = await GamesCollection.updateAsync(gameId, update);
			if (response === 1) {
				game.started = true
				return game;
			} else {
				throw new Meteor.Error('unable-to-start-game', 'An error occurred.  Please try again.');
			}
		} else {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}
	},

	async 'game.join'(gameId: string, playerId: string) {
		check(gameId, String);
		check(playerId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		if (!game) {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}

		if (game?.players.length > 5) {
			throw new Meteor.Error('game-already-full', 'Game is already full.  Please try again.');
		}

		const playerIds = game?.players.map((player: PlayerType) => player._id) || [];
		if (playerIds.includes(playerId)) {
			throw new Meteor.Error('player-already-in-game', 'An error occurred.  You are already in this game.');
		}

		if (game) {
			const update = {
				$push: {
					players: {
						_id: playerId,
						ready: false,
						round: 0,
						cogBonus: 0,
						keys: ["", "", "", ""],
						cards: [],
						results: [],
					}
				}
			}
			const response = await GamesCollection.updateAsync(gameId, update);
			if (response === 1) {
				game.players.push({_id: playerId});
				return game;
			} else {
				throw new Meteor.Error('unable-to-join-game', 'An error occurred.  Please try again.');
			}
		} else {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}
	},

	async 'game.leave'(gameId: string, playerId: string) {
		check(gameId, String);
		check(playerId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		if (!game) {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}

		if (game.isDemo) {
			const response = await resetDemoGame(gameId, playerId);
			if (response) {
				console.log("demo game reset", response)
			}
			return true 
		}

		const updatedPlayers = game?.players.filter((player: PlayerType) => player.ready) || [];
		const update = {
			$set: {
				"players.$[player].ready": false,
			}
		}
		const options: any = {
			arrayFilters: [
				{ "player._id": playerId },
			]
		};

		const response = await GamesCollection.updateAsync({_id: gameId}, update, options);
		if (response === 1) {
			if (updatedPlayers?.length <= 1) {
				Meteor.callAsync('game.complete', gameId).then((result) => {
					return result;
				});
			} else {
				return game
			}
		} else {
			throw new Meteor.Error('unable-to-leave-game', 'An error occurred.  Please try again.');
		}
	},

	async 'game.saveCog'(gameId: string, playerId: string, cards: CardType[], keys: string[]) {
		check(gameId, String);
		check(cards, [Object]);

		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const gameDoc = await GamesCollection.findOneAsync({_id: gameId});
		const game = gameDoc as GameType;

		if (!game) {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}

		const update = {
			$set: {
				"players.$[player].ready": true,
				"players.$[player].cards": regulateCardsRotation(cards),
				"players.$[player].keys": keys
			}
		};

		const options = {
			arrayFilters: [
				{ "player._id": playerId }
			]
		}

		const response = await GamesCollection.updateAsync(gameId, update, options);
		
		if (response === 1) {

			const updatedGame = await GamesCollection.findOneAsync({ _id: gameId }) as GameType;
			return updatedGame;
		} else {
			throw new Meteor.Error('unable-to-save-cards', 'An error occurred.  Please try again.');
		}
	},

	async 'game.checkCog'(gameId: string, playerId: string, cards: CardType[]) {
		check(gameId, String);
		check(playerId, String);
		check(cards, [Object]);

		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId}) as GameType;
		const coplayerId = getPlayerToRender(game, playerId);
		const coplayer = game.players.find((player: PlayerType) => player._id === coplayerId);
		const coplayerPuzzle = coplayer?.cards.filter((card: CardType) => [1, 2, 3, 4].includes(card.position));
		const regulatedCoplayerPuzzle = regulateCardsRotation(coplayerPuzzle || []);
		const playerSolution = cards.filter((card: CardType) => [1, 2, 3, 4].includes(card.position));
		const regulatedPlayerSolution = regulateCardsRotation(playerSolution || []);

		const checkResult = regulatedCoplayerPuzzle?.reduce((accumulator: { [key: number]: boolean }, card: CardType) => {
			const position = card.position;
			const solutionCard = regulatedPlayerSolution.find((card: CardType) => card.position === position);
			if (card._id === solutionCard?._id && card.rotation === solutionCard?.rotation) {
				accumulator[position] = true;
			} else {
				accumulator[position] = false;
			}
			return accumulator;
		}, {});

		const incorrectPositions = Object.keys(checkResult).filter((key) => checkResult[parseInt(key)] === false);

		await incrementAttempt(game, playerId);

		const player = game.players.find((player: PlayerType) => player._id === playerId);
		const attempts = (player.results.find((result: any) => result.round === player.round)?.attempts ?? 0) + 1;

		let score = 0;

		if (incorrectPositions.length === 0 || attempts <= 2) {
			score = calculateRoundScore(game, playerId, incorrectPositions.length);
		}
			
		let response = {
			incorrectPositions: incorrectPositions,
			attempts: attempts,
			score: score,
			roundComplete: false,
			finalRound: game.round >= game.players.length - 1,
			solution: [],
			keys: []
		}

		if (attempts >= 2 || incorrectPositions.length === 0) {

			if (response.score >= 4) {
				incrementCogBonus(game, coplayerId);
			}

			await finalizePlayerRound(game, playerId, attempts, score).then((result) => {
				if (result === 1) {
					const puzzleAuthorId = getPlayerToRender(game, playerId);
					const puzzleAuthor = game.players.find((player: PlayerType) => player._id === puzzleAuthorId);
					response.solution = puzzleAuthor?.cards.filter((card: CardType) => [1, 2, 3, 4].includes(card.position)); 
					response.keys = puzzleAuthor?.keys;
					response.roundComplete = true;
				}
			});
		} 

		return response;
		
	},

	async 'game.advancePlayer'(gameId: string, playerId: string) {
		check(gameId, String);
		check(playerId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId}) as GameType;

		if (!game) {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}

		if (allPlayersReadyForEndGame(game)) {
			const response = await advanceToGameSummary(game);
			return response;
		}

		let gameRound = game.round
		let playerRound = game.round;

		const advanceRound = game.players.reduce((acc: boolean, player: PlayerType) => {
			return player.round < game.round ? false : acc
		}, true)

		if (advanceRound) {
			gameRound = game.round + 1;
			playerRound = game.round + 1;
		}

		const update = {
			$set: {
				"round": gameRound,
				"players.$[player].round": playerRound,
				"players.$[player].ready": false,
			}
		};
		const options = {
			arrayFilters: [
				{ "player._id": playerId }
			]
		}

		const response = await GamesCollection.updateAsync(game._id, update, options);
		if (response === 1) {
			const updatedGame = await GamesCollection.findOneAsync({ _id: gameId }) as GameType;
			return updatedGame;
		} else {
			throw new Meteor.Error('unable-to-start-new-round', 'An error occurred.  Please try again.');
		}
	},

	async "games.getDemo"() {
		const demoGame = await GamesCollection.findOneAsync({isDemo: true}) as GameType;
		if (demoGame) {
			return demoGame;
		} else {
			throw new Meteor.Error('game-not-found', 'Game not found.  Please try again.');
		}
	},

	async "game.resetDemo"(playerId: string) {
		check(playerId, String);
		const game = await GamesCollection.findOneAsync({ isDemo: true }) as GameType;
		const response = await resetDemoGame(game._id, playerId);
		return response
	},

	async "game.getResults"(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = await GamesCollection.findOneAsync({ _id: gameId }) as GameType;
		const response = await getGameResults(game);
		return response
	}

});
