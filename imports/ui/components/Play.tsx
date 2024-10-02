import React, { useEffect, useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// Components
import { Loading } from './Loading';
import { GamePanel } from './GamePanel';
import { Menu } from './Menu';
import { Lobby } from './Lobby';
import { Join } from './Join';
import { Game } from './Game';
import { GameResults } from './GameResults';

// Collections
import { GamesCollection } from '/imports/api/games/GamesCollection';

// Helpers
import { fullName } from '/imports/helpers/reducers';
import { getPlayerToRender } from '/imports/helpers/gameplay';

// Types
import type { GameType } from '../../api/types';

export const Play = () => {
	const [gameId, setGameId] = useState("");
	const [renderGamesList, setRenderGamesList] = useState(false);
	const [renderNewCards, setRenderNewCards] = useState(false);
	
	const game = useTracker(() => GamesCollection.findOne(gameId) as GameType, [gameId]);
	const isLoading = useSubscribe("games");
	console.log("game", Date(), game ?? "null");
	const userSub = useSubscribe("users.all");

	useEffect(() => {
		console.log("useEffect Play");
		const localStorageGameId = localStorage.getItem("gameId") as string;
		if (localStorageGameId) {
			Meteor.callAsync("game.get", localStorageGameId).then((result) => {
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
	}, [game, userSub()]);

	const hostGame = (gameId: string) => {
		if (gameId) {			
			setGameId(gameId);
			localStorage.setItem("gameId", gameId)
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
				localStorage.setItem("gameId", gameId);
			}
		}).catch((error) => {
			console.log("error", error)
		});
	}

	const enterGame = async (game: GameType) => {
		if (game) {
			setGameId(game._id);
			localStorage.setItem("gameId", gameId);
		}
	}

	const advanceRound = () => {
		Meteor.callAsync("game.advancePlayer", gameId, Meteor.userId()).then((result) => {
			if (!result.endGame) {
				setRenderNewCards(true);
			}
		})
	}

	const newCardsRendered = () => {
		setRenderNewCards(false);
	}

	const endGame = (gameId: string) => {
		Meteor.callAsync("game.complete", gameId).then(() => {
			resetGameState();
		}).catch((error) => {
			console.log("error", error)
		});
	}

	const removePlayer = (gameId: string, playerId: string) => {
		Meteor.callAsync("game.leave", gameId, playerId).then(() => {
			if (!game?.players.map((player) => player._id).includes(Meteor.userId())) {
				resetGameState();
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
		if (game?.isDemo) {
			resetDemo();
		}
	}

	const resetDemo = () => {
		if (game?.isDemo) {
			Meteor.callAsync("game.resetDemo", gameId, Meteor.userId());
			Meteor.logout();
		}
	};

	const resetGameState = () => {
		setGameId("");
		localStorage.removeItem("gameId")
	};

	const getPuzzleTitle = () => {
		const playerToRenderId = getPlayerToRender(game, Meteor.userId() ?? "");
		const playerToRenderData = Meteor.users.findOne(playerToRenderId);
		const playerToRenderName = fullName(playerToRenderData);

		if (game.completed) {
			return "Game Over"
		} else if (playerToRenderId === Meteor.userId()) {
			return "Set Your Cog & Keys"
		} else {
			return "Solve "  + playerToRenderName + "'s Cog"
		}
	}

	return (
		<>
			{isLoading() && <Loading /> }

			{!isLoading() && !renderGamesList && !game && 
				<Menu 
					hostGame={hostGame} 
					showGames={showGames}
				/>
			}

			{!isLoading() && renderGamesList && <Join {...{joinGame}} /> }

			{!isLoading() && game && !game.started && !game.completed &&
				<Lobby
					game={game}
					endGame={endGame}
					startGame={startGame}
					removePlayer={removePlayer}
					leaveGame={resetGameState}
					enterGame={enterGame}
				/>
			}

			{!isLoading() && game && game.started && !game.completed &&
				<>
					<GamePanel puzzleTitle={getPuzzleTitle()} exitGame={exitGame}/>
					<Game 
						game={game} 
						advanceRound={advanceRound}
						renderNewCards={renderNewCards}
						newCardsRendered={newCardsRendered}
					/>
				</>
			}

			{!isLoading() && game && game.completed &&
				<>
					<GamePanel puzzleTitle={getPuzzleTitle()} exitGame={exitGame}/>
					<GameResults
						game={game}
					/>
				</>
			}
		</>
	);
}
