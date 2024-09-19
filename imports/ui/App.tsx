import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { CardsCollection } from '../api/cards/CardsCollection';
import { Game } from './components/Game';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { PrivateRoutes } from './components/PrivateRoutes';

export const App = () => {
	const [gameId, setGameId] = useState<string | undefined>(undefined);
	const isLoading = useSubscribe("cards");
	console.log("isLoading", isLoading());
	
	const cards = useTracker(() => CardsCollection.find().fetch());
	console.log("cards", cards.length);
	const user = useTracker(() => Meteor.user());
	// console.log("user", user);

	// Meteor.callAsync("cards.getRandom", 5).then((result) => {
	// 	console.log(result);
	// });

	const handleGameUpdate = (data: string) => {
		setGameId(data);
	}

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
					<Route element={<PrivateRoutes />}>
						<Route path="/play" element={<Game gameId={gameId}/>} />
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Home setGameId={handleGameUpdate}/>} />
				</Routes>
			</div>
		</Router>
	);
};