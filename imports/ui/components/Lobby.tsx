import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe } from 'meteor/react-meteor-data';
import { type Game } from './Game';
import { Loading } from './Loading';
import { fullName } from '/imports/helpers/reducers';

type Player = {
	_id: string
	keys: string[]
	cards: any[]
	results: any[]
}

interface LobbyProps {
	game: Game,
	endGame: Function,
	startGame: Function,
	removePlayer: Function,
	leaveGame: Function
}

// Add first and last name to Meteor User collection per Accounts schema
interface ExtendedUser extends Meteor.User {
	firstName: string,
	lastName: string,
}

export const Lobby:React.FC<LobbyProps> = ({game, endGame, startGame, removePlayer, leaveGame}) => {
	const [players, setPlayers] = useState<any[]>([]);
	const isLoading = useSubscribe("users.all");

	useEffect(() => {
		console.log("useEffect Lobby");

		const inPendingGame = () => {
			const playerIds = game.players.map((player: Player) => player._id);
			const inGame = playerIds.includes(Meteor.userId() ?? "");
			return inGame && !game.started && !game.completed;
		}

		if (game && inPendingGame()) {
			loadLobbyPlayers();
		} else if (game) {
			leaveGame();
		}
	}, [game, isLoading()]);

	const loadLobbyPlayers = () => {
		const updatedPlayers = game.players.map((player: Player) => {
			const playerDoc = Meteor.users.findOne(player._id) as ExtendedUser | undefined;

			const status = () => {
				// TODO: get player online status and connected to current game
				return "Ready"
			}

			const updatedPlayer = {
				...player,
				fullName: fullName(playerDoc),
				email: playerDoc?.emails?.[0]?.address,
				status: status(),
			}

			return updatedPlayer;

		});

		setPlayers(updatedPlayers || []);

	};

	const handleClickPlayer = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const playerId = (e.target as HTMLElement).closest(".player-card")?.id;
		const userIsHost = game.hostId === Meteor.userId();
		const playerIsHost = playerId === game.hostId;

		if (userIsHost && playerIsHost) {
			// TODO end game and remove all players
			endGame(game._id);
		} else {
			removePlayer(game._id, playerId);
		}
	}

	const handleStartGame = () => {
		console.log("startGame");
		startGame(game._id);
	}

	const isHost = () => {
		if (!game) return false;
		return game.hostId === Meteor.userId();
	}

	return (
		<div className="lobby-container min-h-screen flex items-center justify-center w-full">
			<div className=" bg-white shadow-lg overflow-hidden border border-gray-300 rounded-lg px-8 py-6 max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center">Lobby</h1>
				{ isLoading() ? <Loading /> : 
					<>
						<ul className="overflow-scroll">
							{players.map((player) => (
								<li key={player._id} id={player._id} className="player-card border border-gray-300 my-4 shadow-md">
									<div className="px-4 py-5 sm:px-6">
										<div className="flex items-center justify-between h-6">
											<h3 className="text-lg leading-6 font-medium text-gray-900">{player.fullName}</h3>
											<p className="mt-1 max-w-2xl text-sm text-gray-500">
												{player._id === Meteor.userId() && "You"}
												{player._id !== Meteor.userId() && player._id === game.hostId && "Host"}
												{player._id !== Meteor.userId() && player._id !== game.hostId && "Player"}
											</p>
										</div>
										<div className="mt-4 flex items-center justify-between h-6">
											<button onClick={handleClickPlayer} className="font-medium text-indigo-600 hover:text-indigo-500">
												{game.hostId === Meteor.userId() && (
													player._id === game.hostId ? "End Game" : "Remove"
												)}
												{game.hostId !== Meteor.userId() && player._id === Meteor.userId() && "Leave"}
											</button>
											<p className="text-sm font-medium text-gray-500">Status: <span className="text-green-600">{player.status}</span></p>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="flex flex-col items-center justify-center">
							{ isHost()
								?
									<button onClick={handleStartGame} type="submit" disabled={players.length < 2} className="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										Start Game
									</button>
								: 
									<div className="flex flex-col items-center justify-center">
										<p className="text-sm font-medium text-gray-500">Waiting for the host to start game.</p>
									</div>
							}
							<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
								{game?.players?.length < 2 && "Not enough players"}
							</div>
						</div>
					</>
				}
			</div>
		</div>
	);
};