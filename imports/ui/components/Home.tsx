import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

	const user = useTracker(() => Meteor.user());
	const navigate = useNavigate();

	const logout = () => {
		Meteor.logout();
	}

	const playDemo = async () => {
		if (Meteor.user()) {
			logout();
		}

		const demoPlayer = await Meteor.callAsync("accounts.getDemoPlayer");
		const demoGame = await Meteor.callAsync("games.getDemo");

		Meteor.loginWithPassword(demoPlayer.username, demoPlayer.password, (error) => {
			if (error) {
				console.log(error);
			} else if (demoGame.players.map((player: { _id: string })=> player._id).includes(demoPlayer._id)) {
				localStorage.setItem("gameId", demoGame._id);
				navigate("/play");
			}
		})
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
				<button onClick={playDemo}>Demo</button>
			</div>
		</>
	);
};