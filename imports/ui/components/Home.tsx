import React from 'react';
import { Meteor } from 'meteor/meteor';

export const Home = () => {

	const logout = () => {
		Meteor.logout();
	}

	const user = Meteor.user();

	return (
		<div className="home-container">
			{user ? (
				<>
					<h1>Welcome, {user.username}!</h1>
					<button className="button" onClick={logout}>Logout</button>
				</>
			) : (
				<h1>Please log in to play.</h1>
			)}
		</div>
};