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
	const isLoading = useSubscribe("games");
	const game = useTracker(() => GamesCollection.findOne(gameId) as GameType);
	// console.log("game declaration", game);
	const [cards, setCards] = useState<CardType[]>([]);
	const [initialKeys, setInitialKeys] = useState<string[]>(["", "", "", ""]);

	useEffect(() => {
		console.log("useEffect Play");
		const localStorageGameId = localStorage.getItem("gameId") as string;
		if (localStorageGameId) {
			Meteor.callAsync("game.get", localStorageGameId).then((result) => {
				if (result) {
					setGameId(localStorageGameId);
					enterGame(result);
				} else {
					localStorage.setItem("gameId", "");
				}
			}).catch((error) => {
				console.log("error", error)
				localStorage.setItem("gameId", "");
			})
		}
	}, []);

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
		setRenderGamesList(false)
	}

	const startGame = (gameId: string) => {
		Meteor.callAsync("game.start", gameId).then((result) => {			
			if (result._id === gameId) {
				const game = result as GameType;
				const player = game.players.find((player: PlayerType) => player._id === Meteor.userId());
				const playerCards = player.cards;
				const placeholderCards = [1, 2, 3, 4].map((position) => {
					return { _id: position.toString(), words: ["", "", "", ""], position: position }
				});

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
			const playerCards = player.cards;
			setCards([...playerCards]);
			setInitialKeys(player.keys);
			setGameStarted(game.started);
			setGameCompleted(game.completed);
		}
	}

	const endGame = (gameId: string) => {
		Meteor.callAsync("game.complete", gameId).then(() => {
			setGameId("");
		}).catch((error) => {
			console.log("error", error)
		});
	}

	const removePlayer = (gameId: string, playerId: string) => {
		Meteor.callAsync("game.leave", gameId, playerId).then(() => {
			if (playerId === Meteor.userId()) {
				resetGameState();
				localStorage.removeItem("gameId");
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
	};

	return (
		<>
			{isLoading() && <Loading /> }

			{!isLoading() && renderGamesList && <Join {...{joinGame}} /> }

			{!isLoading() && !game && <Menu 
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
					<Game game={game} cards={cards} initialKeys={initialKeys} />
				</>
			)}
		</>
	);
}
