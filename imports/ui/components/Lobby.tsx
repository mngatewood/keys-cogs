import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { type Game } from './Game';

export const Lobby= ({game}: {game: Game}) => {
	const [players, setPlayers] = useState<any[]>([]);
	const navigate = useNavigate();
	const isLoading = useSubscribe("users.user");

	useEffect(() => {
		if (game) {
			const updatedPlayers = game.players.map((player) => {
				const playerDoc = Meteor.users.findOne(player._id);
				console.log("playerDoc", playerDoc);
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
				console.log("updatedPlayer", updatedPlayer);
				return updatedPlayer;
			})
			setPlayers(updatedPlayers || []);
		// } else {
		// 	navigate("/");
		}
	}, [game]);

	const handleStartGame = () => {
		console.log("start game")
	}

	return (
		<div className="lobby-container min-h-screen flex items-center justify-center w-full">
			<div className=" bg-white shadow-lg overflow-hidden border border-gray-300 rounded-lg px-8 py-6 max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Lobby</h1>
				<ul className="overflow-scroll">
					{players.map((player) => (
						<li key={player._id} className="border border-gray-300 shadow-md">
							<div className="px-4 py-5 sm:px-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg leading-6 font-medium text-gray-900">{player.fullName}</h3>
									<p className="text-sm font-medium text-gray-500">Status: <span className="text-green-600">{player.status}</span></p>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<p className="mt-1 max-w-2xl text-sm text-gray-500">{player.email}</p>
									{player.status === "Ready"
										? <button className="font-medium text-indigo-600 hover:text-indigo-500">Leave</button>
										: <button className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
									}
								</div>
							</div>
						</li>
					))}
				</ul>
				<div className="flex flex-col items-center justify-center">
					<button onClick={handleStartGame} type="submit" disabled={players.length < 2} className="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						"Start Game"
					</button>
					<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
						{game?.players?.length < 2 && "Not enough players"}
					</div>
				</div>
			</div>
		</div>
	);
};