import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { GamesCollection, GamesCollectionSchema } from './GamesCollection';
import type { Player } from '../types'
import { shuffleArray } from '/imports/helpers/shuffle';
import { CardsCollection } from '../cards/CardsCollection';

Meteor.methods({
	async 'games.insert'(host: string) {
		check(host, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const game = {
			hostId: Meteor.userId(),
			round: 0,
			started: false,
			completed: false,
			cards: [],
			players: [
				{
					_id: host,
					keys: [],
					cards: [],
					results: []
				}
			]
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
		console.log("completing game", game)
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
			game.players.map((player: Player, index: number) => {
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

		const playerIds = game?.players.map((player: Player) => player._id) || [];
		if (playerIds.includes(playerId)) {
			throw new Meteor.Error('player-already-in-game', 'An error occurred.  You are already in this game.');
		}

		console.log("joining game", game)
		if (game) {
			const update = {
				$push: {
					players: {
						_id: playerId,
						keys: [],
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
		const updatedPlayers = game?.players.filter((player: Player) => player._id !== playerId) || [];
		if (updatedPlayers?.length > 0) {
			const update = {
				$pull: {
					players: {
							_id: playerId
					}
				}
			}
			const response = await GamesCollection.updateAsync({_id: gameId}, update);
			if (response === 1) {
				game.players = updatedPlayers;
				return game;
			} else {
				throw new Meteor.Error('unable-to-leave-game', 'An error occurred.  Please try again.');
			}
		} else {
			Meteor.callAsync('game.end', gameId).then((result) => {
				return result;
			});
		}
	},

});
