import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

interface MenuProps {
	hostGame: Function,
	showGames: Function
}

export const Menu: React.FC<MenuProps> = ({hostGame, showGames}) => {

	const user = useTracker(() => Meteor.user());

	const handleHostGame = () => {
		Meteor.callAsync("games.insert", user?._id).then((result) => {
			hostGame(result);
		});
	}

	const handleListGames = () => {
		showGames();
	}

	return (
		<>
			<div className="home-container">
				<>
					<h1 className="text-2xl font-bold text-center mb-4">Ready to begin?</h1>
					<h3 className="text-lg font-bold text-center mb-4">Click "Host a Game" to start a new game or "Join a Game" to join an existing game.</h3>
					<button className="button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleHostGame}>
						Host a Game
					</button>
					<button className="button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleListGames}>
						Join a Game
					</button>
				</>
			</div>
		</>
	);
};