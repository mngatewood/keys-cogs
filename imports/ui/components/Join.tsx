import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { type Game } from './Game';
import { Loading } from './Loading';
import { GamesCollection } from '/imports/api/games/GamesCollection';
import { useNavigate } from 'react-router-dom';
import {fullName } from '/imports/helpers/reducers';

interface JoinProps {
	setGameId: Function,
}

interface ExtendedUser extends Meteor.User {
	firstName: string,
	lastName: string,
}

interface ExtendedGame extends Meteor.User {
	hostName: string,
	playerCount: number
}

export const Join:React.FC<JoinProps> = ({setGameId}) => {
	const [games, setGames] = useState<ExtendedGame[]>([]);
	const [joinError, setJoinError] = useState<string | undefined>(undefined);
	const isLoading = useSubscribe("games.pending");
	const userSub = useSubscribe("users.all");
	const pendingGames = useTracker(() => GamesCollection.find().fetch() as Game[]);
	const navigate = useNavigate();

	useEffect(() => {
		if (pendingGames ) {
			loadPendingGames();
		}
	}, [isLoading(), userSub()]);

	const loadPendingGames = () => {
		const updatedGames = pendingGames.map((game: Game) => {
			// TODO: detect host presence
			const host = Meteor.users.findOne(game.hostId) as ExtendedUser || undefined;

			const updatedGame:ExtendedGame = {
				...game,
				hostName: fullName(host),
				playerCount: game.players.length
			}

			return updatedGame;

		})

		setGames(updatedGames || []);
	}

	const handleJoinGame = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const gameId = (e.target as HTMLElement).closest(".game-card")?.id;
		if (gameId) {
			Meteor.callAsync("game.join", gameId, Meteor.userId()).then((result) => {
				console.log("updatedGame", result)
				setGameId(gameId);
				navigate("/play");
			}).catch((error) => {
				console.log("joinError", error)
				setJoinError(error.reason);
			});
		} else {
			setJoinError("Something went wrong. Please try again.");
		}
	}

	return (
		<div className="join-container min-h-screen flex items-center justify-center w-full">
			<div className=" bg-white shadow-lg overflow-hidden border border-gray-300 rounded-lg px-8 py-6 max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Join a Game</h1>
				{isLoading() ? <Loading /> :
					<>
						<ul className="overflow-scroll">
							{games.map((game) => (
								<li key={game._id} id={game._id} className="game-card border border-gray-300 shadow-md my-4">
									<div className="flex px-4 py-5 sm:px-6">
										<div className="flex flex-col items-start justify-between w-3/4">
											<h3 className="text-lg leading-6 font-medium text-gray-900">{game.hostName}</h3>
											<p className="mt-1 max-w-2xl text-sm text-gray-500">Number of Players: {game.playerCount}</p>
										</div>
										<div className="flex flex-col justify-center items-end w-1/4">
											<button onClick={handleJoinGame} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												Join
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="flex flex-col items-center justify-center">
							<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
								{joinError}
							</div>
						</div>
					</>
				}
			</div>
		</div>
	);
};