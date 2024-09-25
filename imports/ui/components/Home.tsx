import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const Home = () => {

	const user = useTracker(() => Meteor.user());

	const logout = () => {
		Meteor.logout();
	}

	return (
		<>
			<div className="home-container">
				{user ?
					<>
						<h1>Welcome, {user.username}!</h1>
						<button className="button" onClick={logout}>Logout</button>
						<button className="button">
							<a href="/play">Play</a>
						</button>
					</>
				:
					<>
						<h1>Welcome!</h1>
						<h1>Please <a href="/login">log in</a> to play.</h1>
					</>
				}
			</div>
		</>
};