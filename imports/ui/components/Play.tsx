
import React, { useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// Components
import { Loading } from './Loading';
import { Menu } from './Menu';
import { Lobby } from './Lobby';
import { Join } from './Join';

// Collections
import { GamesCollection } from '/imports/api/games/GamesCollection';

// TODO Consolidate types
type Game = {
	_id: string,
	hostId: string,
	round: number,
	players: Array<any>,
	cards: Array<string>,
	completed: boolean,
	started: boolean,
}

export const Play = () => {
	const [gameId, setGameId] = useState("");
	const [gameStarted, setGameStarted] = useState(false);
	const [gameCompleted, setGameCompleted] = useState(false);
	const [renderGamesList, setRenderGamesList] = useState(false);
	const isLoading = useSubscribe("games");
	const game = useTracker(() => GamesCollection.findOne(gameId) as Game);

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
		Meteor.callAsync("game.start", gameId).then(() => {
			// setGame(result);
			// setGameStarted(true);

			console.log("startGame", gameId)
			// TODO deal cards and render game
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
				<div>Game</div>
			)}
		</>
	);
}
