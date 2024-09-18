import React from 'react';
import { Meteor } from 'meteor/meteor';

export const Home = () => {

	const logout = () => {
		Meteor.logout();
	}

	const user = Meteor.user();

	const startGame = () => {
		console.log("start game")
	}

	return (
		<>
			<div className="home-container">
				{user ?
					<>
						<h1>Welcome, {user.username}!</h1>
						<button className="button" onClick={logout}>Logout</button>
						<button className="button" onClick={startGame}>Host Game</button>
					</>
				:
					<>
						<h1>Welcome!</h1>
						<h1>Please log in to play.</h1>
					</>
				}
			</div>
		</>
};