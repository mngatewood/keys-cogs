import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import type { GameType } from '../../api/types';
import { Loading } from './Loading';
import { GamesCollection } from '/imports/api/games/GamesCollection';
import {fullName } from '/imports/helpers/reducers';

interface JoinProps {
	joinGame: Function,
}

interface ExtendedUser extends Meteor.User {
	firstName: string,
	lastName: string,
}

interface ExtendedGame extends Meteor.User {
	hostName: string,
	playerCount: number
}

export const Join:React.FC<JoinProps> = ({joinGame}) => {
	const [games, setGames] = useState<ExtendedGame[]>([]);
	const [joinError, setJoinError] = useState<string | undefined>(undefined);
	const isLoading = useSubscribe("games.pending");
	const userSub = useSubscribe("users.all");

	const gamesQuery = {
		started: false,
		completed: false,
		isDemo: false,
		players: {
			$size: {
				$lt: 6
			},
			$elemMatch: {
				_id: {
					$ne: Meteor.userId()
				}
			}
		}
	};

	const gamesOptions = {
		sort: { createdAt: -1 },
	}
	const pendingGames = useTracker(() => GamesCollection.find(gamesQuery, gamesOptions).fetch() as GameType[]);

	useEffect(() => {
		if (pendingGames ) {
			loadPendingGames();
		}
	}, [isLoading(), userSub(), pendingGames?.length]);

	const loadPendingGames = () => {
		if (pendingGames.length === 0) {
			setJoinError("No pending games.");
		} else {
			setJoinError(undefined);
		}
		const updatedGames = pendingGames.map((game: GameType) => {
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
				if (result) {
					joinGame(gameId);
				}
			}).catch((error) => {
				console.log("joinError", error)
				setJoinError(error.reason);
			});
		} else {
			setJoinError("Something went wrong. Please try again.");
		}
	}

	const handleHostGame = () => {
		Meteor.callAsync("games.insert", Meteor.userId()).then((result) => {
			joinGame(result);
		}).catch((error) => {
			console.log("hostError", error)
			setJoinError("Something went wrong. Please try again.");
		});
	}

	return (
		<div className="overflow-scroll flex items-center justify-center w-full h-full">
			<div className="bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto max-w-md w-5/6">
				<h1 className="text-2xl font-bold text-center mb-4">Join a Game</h1>
				{isLoading() ? <Loading /> :
					<>
						<ul className="overflow-auto">
							{games.map((game) => (
								<li key={game._id} id={game._id} className="game-card border border-gray-300 shadow-md my-4">
									<div className="flex px-4 py-5 sm:px-6">
										<div className="flex flex-col items-start justify-between w-3/4">
											<h3 className="text-lg leading-6 font-medium text-gray-900">{game.hostName}</h3>
											<p className="mt-1 max-w-2xl text-sm text-gray-500">Number of Players: {game.playerCount}</p>
										</div>
										<div className="flex flex-col justify-center items-end w-1/4">
											<button onClick={handleJoinGame} className="button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">
												Join
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="flex flex-col items-center justify-center">
							<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
								{ joinError === "No pending games." 
									? 
										<>
											<p className="mb-4">No pending games.</p>
											<p>
												<span>Please try again later or </span>
											<button onClick={handleHostGame} className="underline inline border border-transparent text-sm font-medium bg-transparent text-blue-2  hover:text-blue-1 focus:outline-none">
												host 
											</button>
											<span> a new game.</span> 
											</p>  
										</>
									: joinError
								}
							</div>
						</div>
					</>
				}
			</div>
		</div>
	);
};