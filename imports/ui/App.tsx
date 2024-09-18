import React from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { CardsCollection } from '../api/cards/CardsCollection';
import { Game } from './components/Game';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';

export const App = () => {
	const isLoading = useSubscribe("cards");
	console.log("isLoading", isLoading());
	const cards = useTracker(() => CardsCollection.find().fetch());
	console.log("cards", cards);
	const user = useTracker(() => Meteor.user());
	console.log("user", user);

	// Meteor.callAsync("cards.getRandom", 5).then((result) => {
	// 	console.log(result);
	// });

	return (
		<Router>
			<div>
				<nav className="navbar">
					<ul>
						<li><Link to="/">Home</Link></li>
						{!user && <li><Link to="/login">Login</Link></li>}
						{user && <li><Link to="/play">Play</Link></li>}
					</ul>
				</nav>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/play" element={<Game />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</Router>
	);
};