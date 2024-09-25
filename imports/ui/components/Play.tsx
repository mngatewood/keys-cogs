import React, { useState } from 'react';
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
	const [cards, setCards] = useState<CardType[]>([]);

	// TODO
	// const startDemo = () => {
	// 	const allCardData = demoCards as CardType[];
	// 	setKeys(demoKeys);
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
				setGameStarted(true);
			}
		}).catch((error) => {
			console.log("error", error)
		});
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
			}
		}).catch((error) => {
			console.log("error", error)
		})
		return true;
	}

	const resetGameState = () => {
		setGameId("");
		setGameCompleted(false);
		setGameStarted(false);
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
				/>
			}

			{!isLoading() && game && gameStarted && !gameCompleted && (
				<Game game={game} cards={cards} />
			)}
		</>
	);
}
