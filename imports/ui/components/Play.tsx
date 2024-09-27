import React, { useEffect, useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// Components
import { Loading } from './Loading';
import { Menu } from './Menu';
import { Lobby } from './Lobby';
import { Join } from './Join';
import { Game } from './Game';

// Collections
import { GamesCollection } from '/imports/api/games/GamesCollection';

// Types
import type { GameType, CardType, PlayerType } from '../../api/types';

export const Play = () => {
	const [gameId, setGameId] = useState("");
	const [gameStarted, setGameStarted] = useState(false);
	const [gameCompleted, setGameCompleted] = useState(false);
	const [renderGamesList, setRenderGamesList] = useState(false);
	const [cardsFetched, setCardsFetched] = useState(false);
	
	const isLoading = useSubscribe("games");
	const game = useTracker(() => GamesCollection.findOne(gameId) as GameType);
	console.log("game", Date(), game ?? "null");
	const [cards, setCards] = useState<CardType[]>([]);
	const [initialKeys, setInitialKeys] = useState<string[]>(["", "", "", ""]);
	const placeholderCards = [1, 2, 3, 4].map((position) => {
		return { _id: position.toString(), words: ["", "", "", ""], position: position }
	});

	useEffect(() => {
		console.log("useEffect Play");
		const localStorageGameId = localStorage.getItem("gameId") as string;
		if (localStorageGameId && !cardsFetched) {
			Meteor.callAsync("game.get", localStorageGameId).then((result) => {
				setGameId(localStorageGameId);
				setGameStarted(result.started);
				setGameCompleted(result.completed);
				if (result) {
					enterGame(result);
				} else {
					localStorage.setItem("gameId", "");
				}
			}).catch((error) => {
				console.log("error", error)
				localStorage.removeItem("gameId");
			})
		}
	}, [cards]);

	// TODO
	// const startDemo = () => {
	// 	const allCardData = demoCards as CardType[];
	// 	setInitialKeys(demoKeys);
	// 	dealCards(allCardData)
	// }

	const hostGame = (gameId: string) => {
		if (gameId) {			
			setGameId(gameId);
			setGameStarted(false);
			setGameCompleted(false);
		}
	};

	const showGames = () => {
		setRenderGamesList(true);
	}

	const joinGame = (gameId: string) => {
		setGameId(gameId);
		localStorage.setItem("gameId", gameId)
		setRenderGamesList(false)
	}

	const startGame = (gameId: string) => {
		Meteor.callAsync("game.start", gameId).then((result) => {			
			if (result._id === gameId) {
				const game = result as GameType;
				const player = game.players.find((player: PlayerType) => player._id === Meteor.userId());
				const playerCards = player.cards;

				setCards([...playerCards, ...placeholderCards]);
				setGameStarted(game.started);
				setGameCompleted(game.completed);
				localStorage.setItem("gameId", gameId);
			}
		}).catch((error) => {
			console.log("error", error)
		});
	}

	const enterGame = async (game: GameType) => {
		if (game) {
			const player = game.players.find((player: PlayerType) => player._id === Meteor.userId());
			const playerCards = player.cards.filter((card: CardType) => !["1", "2", "3", "4"].includes(card._id));
			setCards([...playerCards, ...placeholderCards]);
			setInitialKeys(player.keys.length ? player.keys : ["", "", "", ""]);
			setGameStarted(game.started);
			setGameCompleted(game.completed);
			localStorage.setItem("gameId", gameId);
			setCardsFetched(true);
			// TODO consolidate startGame and enterGame
		}
	}

	const advanceRound = () => {
		console.log("advanceRound", game);

		Meteor.callAsync("game.advancePlayer", gameId, Meteor.userId()).then((result) => {
			const playerIds = result.players.map((player: PlayerType) => player._id) || [];
			const playerIdsExtended = [...playerIds, ...playerIds];
			const playerIndex = playerIds.indexOf(Meteor.userId() ?? "");
			const nextPlayerId = playerIdsExtended[playerIndex + result.round];
			const nextPlayer = result.players.find((player: PlayerType) => player._id === nextPlayerId);
			const nextPlayerCards = nextPlayer.cards.filter((card: CardType) => !["1", "2", "3", "4"].includes(card._id));
			const nextPlayerCardsReset = nextPlayerCards.map((card: CardType) => {
				card.position = 5;
				card.rotation = 0;
				return card
			})
			setCards([...nextPlayerCardsReset, ...placeholderCards]);
			setInitialKeys(nextPlayer.keys);
		}).catch((error) => {
			console.log("error", error)
		})
	}

	const endGame = (gameId: string) => {
		Meteor.callAsync("game.complete", gameId).then(() => {
			setGameId("");
			localStorage.removeItem("gameId")
		}).catch((error) => {
			console.log("error", error)
		});
	}

	const removePlayer = (gameId: string, playerId: string) => {
		Meteor.callAsync("game.leave", gameId, playerId).then(() => {
			if (playerId === Meteor.userId()) {
				resetGameState();
			}
			if (playerId === game?.hostId) {
				endGame(gameId);
			}
		}).catch((error) => {
			console.log("error", error)
		})
		return true;
	}

	const exitGame = () => {
		const userId = Meteor.userId();
		if (userId) {			
			removePlayer(gameId, userId);
		}
	}

	const resetGameState = () => {
		setGameId("");
		setGameCompleted(false);
		setGameStarted(false);
		setInitialKeys(["", "", "", ""]);
		localStorage.removeItem("gameId")
	};

	return (
		<>
			{isLoading() && <Loading /> }

			{!isLoading() && renderGamesList && <Join {...{joinGame}} /> }

			{!isLoading() && !game && 
				<Menu 
					hostGame={hostGame} 
					showGames={showGames}
				/>
			}

			{!isLoading() && game && !gameStarted && !gameCompleted &&
				<Lobby
					game={game}
					endGame={endGame}
					startGame={startGame}
					removePlayer={removePlayer}
					leaveGame={resetGameState}
					enterGame={enterGame}
				/>
			}

			{!isLoading() && game && gameStarted && !gameCompleted && (
				<>
					<div className='game-panel z-top'>
						<button onClick={exitGame}>
							<img className='exit-img' src='/exit-icon.png' />
						</button>
					</div>
					<Game 
						game={game} 
						cards={cards} 
						initialKeys={initialKeys}
						advanceRound={advanceRound}
					/>
				</>
			)}
		</>
	);
}
