import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

interface HomeProps {
	setGameId: Function
}

export const Home:React.FC<HomeProps> = ({setGameId}) => {

	const navigate = useNavigate();

	const logout = () => {
		Meteor.logout();
	}

	const user = Meteor.user();

	const startGame = () => {
		console.log("start game")

		Meteor.callAsync("games.insert", user?._id).then((result) => {
			console.log(result);
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