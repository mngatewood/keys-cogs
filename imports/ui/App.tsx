import React from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';

// Components
import { Loading } from './components/Loading';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { PrivateRoutes } from './components/PrivateRoutes';
import { Play } from './components/Play';

export const App = () => {
	const isLoading = useSubscribe("cards");
	
	const user = useTracker(() => Meteor.user());

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
							<Route path="/play" element={<Play />} />
						</Route>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/" element={<Home />} />
					</Routes>
				}
			</div>
		</Router>
	);
};