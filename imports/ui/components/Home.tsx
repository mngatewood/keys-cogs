import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

interface HomeProps {
	setGameId: Function
}

export const Home:React.FC<HomeProps> = ({setGameId}) => {

	const navigate = useNavigate();

	const logout = () => {
		Meteor.logout();
	}

	const user = useTracker(() => Meteor.user());

	const startGame = () => {
		Meteor.callAsync("games.insert", user?._id).then((result) => {
			setGameId(result);
			navigate("/play");
		});
	}

	return (
		<>
			<div className="home-container">
				{user ?
					<>
						<h1>Welcome, {user.username}!</h1>
						<button className="button" onClick={logout}>Logout</button>
						<button className="button" onClick={startGame}>Host Game</button>
						<button className="button">
							<a href="/join">Join Game</a>
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