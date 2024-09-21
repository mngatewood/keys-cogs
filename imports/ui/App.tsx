import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';

// Collections
import { CardsCollection } from '../api/cards/CardsCollection';

// Components
import { PrivateRoutes } from './components/PrivateRoutes';
import { Loading } from './components/Loading';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Join } from './components/Join';
import { Game } from './components/Game';

export const App = () => {
	const [gameId, setGameId] = useState<string | undefined>(undefined);
	const isLoading = useSubscribe("cards");
	
	// const cards = useTracker(() => CardsCollection.find().fetch());
	const user = useTracker(() => Meteor.user());

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
				{ isLoading() ? <Loading /> :
					<Routes>
						<Route element={<PrivateRoutes />}>
							<Route path="/join" element={<Join setGameId={handleGameUpdate} />} />
							<Route path="/play" element={<Game gameId={gameId ?? ""} />} />
						</Route>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/" element={<Home setGameId={handleGameUpdate}/>} />
					</Routes>
				}
			</div>
		</Router>
	);
};