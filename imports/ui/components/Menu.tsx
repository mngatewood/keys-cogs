import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { getDemo } from '/imports/helpers/utils';
import { useNavigate } from 'react-router-dom';

interface MenuProps {
	joinGame: Function,
	showGames: Function
}

export const Menu: React.FC<MenuProps> = ({joinGame, showGames}) => {
	const [isDemo, setIsDemo] = useState(false);

	const user = useTracker(() => Meteor.user());
	const navigate = useNavigate();

	useEffect(() => {
		const getGameIsDemo = async (userId: string) => {
			const demoGame = await Meteor.callAsync("games.getDemo");
			const demoGamePlayers = demoGame.players.map((player: any) => player._id);
			if (demoGamePlayers.includes(userId)) {
				setIsDemo(true);
			} else {
				setIsDemo(false);
			}
		}

		if(user) {
			getGameIsDemo(user._id);
		} else {
			navigate("/login");
		}
	}, [user]);

	const handleHostGame = () => {
		Meteor.callAsync("games.insert", user?._id).then((result) => {
			joinGame(result);
		});
	}

	const handleListGames = () => {
		showGames();
	}

	const handleExitDemo = async () => {
		const reset = await Meteor.callAsync("game.resetDemo", Meteor.userId());
		if (reset) {
			localStorage.removeItem("gameId");
			Meteor.logout();
			navigate("/");
		}
	}

	return (
		<>
			<div className="flex items-center justify-center overflow-scroll w-full h-full">
				<div className="bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto max-w-md w-5/6">
					{!isDemo 
						?
							<>
								<h1 className="text-2xl font-bold text-center mb-4">Ready to begin?</h1>
								<h3 className="text-lg font-bold text-center mb-4">Click "Host a Game" to start a new game or "Join a Game" to join an existing game.</h3>
								<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleHostGame}>
									Host a Game
								</button>
								<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleListGames}>
									Join a Game
								</button>
							</>
						:
							<>
								<h1 className="text-2xl font-bold text-center mb-4">Demo Game</h1>
								<h3 className="text-lg font-bold text-center mb-4">It looks like you didn't finish the demo.</h3>
								<h3 className="text-lg font-bold text-center mb-4">Click the button below and we'll put the game away.</h3>
								<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleExitDemo}>
									Home
								</button>
							</>
					}
				</div>
			</div>
		</>
	);
};