import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe } from 'meteor/react-meteor-data';
import { type Game } from './Game';
import { Loading } from './Loading';

interface LobbyProps {
	game: Game,
	endGame: Function,
	startGame: Function,
	removePlayer: Function,
	leaveGame: Function,
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

		if (game) {
			loadLobbyPlayers();
		}
	}, [game, isLoading()]);

	const loadLobbyPlayers = () => {
		const updatedPlayers = game.players.map((player) => {
			const playerDoc = Meteor.users.findOne(player._id) as ExtendedUser | undefined;

			// TODO: move fullName to helpers and import
			const fullName = () => {
				const firstName = playerDoc?.firstName || "";
				const lastName = playerDoc?.lastName || "";
				const lastInitial = lastName ? lastName.charAt(0) : "";
				return firstName + (lastInitial ? " " + lastInitial : "");
			}

			const status = () => {
				// TODO: get player online status and connected to current game
				return "Ready"
			}

			const updatedPlayer = {
				...player,
				fullName: fullName(),
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
		} else if (userIsHost && !playerIsHost) {
			// TODO remove player and update game
			removePlayer(playerId);
		} else if (playerId === Meteor.userId()) {
			// TODO leave game
			leaveGame(game._id);
		}
	}

	const handleStartGame = () => {
		startGame(game._id);
	}

	return (
		<div className="lobby-container min-h-screen flex items-center justify-center w-full">
			<div className=" bg-white shadow-lg overflow-hidden border border-gray-300 rounded-lg px-8 py-6 max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Lobby</h1>
				{ isLoading() ? <Loading /> : 
					<>
						<ul className="overflow-scroll">
							{players.map((player) => (
								<li key={player._id} id={player._id} className="player-card border border-gray-300 shadow-md">
									<div className="px-4 py-5 sm:px-6">
										<div className="flex items-center justify-between h-6">
											<h3 className="text-lg leading-6 font-medium text-gray-900">{player.fullName}</h3>
											<button onClick={handleClickPlayer} className="font-medium text-indigo-600 hover:text-indigo-500">
												{game.hostId === Meteor.userId() && (
													player._id === game.hostId ? "End Game" : "Remove"
												)}
												{game.hostId !== Meteor.userId() && player._id === Meteor.userId() && "Leave"}
											</button>
										</div>
										<div className="mt-4 flex items-center justify-between h-6">
											<p className="mt-1 max-w-2xl text-sm text-gray-500">
												{player._id === Meteor.userId() && "You"}
												{player._id !== Meteor.userId() && player._id === game.hostId && "Host"}
												{player._id !== Meteor.userId() && player._id !== game.hostId && "Player"}
											</p>
											<p className="text-sm font-medium text-gray-500">Status: <span className="text-green-600">{player.status}</span></p>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="flex flex-col items-center justify-center">
							{/* next line to enable start game button */}
							<button onClick={handleStartGame} type="submit" className="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							{/* <button onClick={handleStartGame} type="submit" disabled={players.length < 2} className="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> */}
								"Start Game"
							</button>
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