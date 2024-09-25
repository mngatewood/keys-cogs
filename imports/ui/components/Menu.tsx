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
					<h1>Welcome, {user?.username}!</h1>
					<button className="button" onClick={handleHostGame}>Host a Game</button>
					<button className="button" onClick={handleListGames}>Join a Game</button>
				</>
			</div>
		</>
	);
};