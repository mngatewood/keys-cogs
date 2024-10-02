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
import { Header } from './components/Header';
import { Account } from './components/Account';

export const App = () => {
	const isLoading = useSubscribe("cards");
	
	const user = useTracker(() => Meteor.user() as Meteor.User);

	return (
		<Router>
			<div>
				<Header user={user} />
				{ isLoading() ? <Loading /> :
					<Routes>
						<Route element={<PrivateRoutes />}>
							<Route path="/play" element={<Play />} />
						</Route>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/account" element={<Account />} />
						<Route path="/" element={<Home />} />
					</Routes>
				}
			</div>
		</Router>
	);
};