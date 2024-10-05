import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Utils
import { debounce } from '/imports/helpers/utils';

export const App = () => {
	const isLoading = useSubscribe("cards");
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	const user = useTracker(() => Meteor.user() as Meteor.User);

	useEffect(() => {
		// store window size in state on resize
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener("resize", debounce(handleResize));
		return () => window.removeEventListener("resize", handleResize);

	}, []);

	// calculate minvh based on window size for consistency with styled elements
	const minvh = () => {
		return size.height > size.width ? size.width * 0.01 : size.height * 0.01;
	}

	let headerHeight = minvh() * 8.5;

	// set main element height to window height minus header height
	let style: React.CSSProperties = { 
		height: `${size.height - headerHeight}px`,
		margin: `${headerHeight}px 0 0 0`,
	};

	return (
		<Router>
			<div className="app">
				<Header user={user} />
				{ isLoading() ? <Loading /> :
					<main style={style}>
						<Routes>
							<Route element={<PrivateRoutes />}>
								<Route path="/account" element={<Account />} />
								<Route path="/play" element={<Play />} />
							</Route>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/" element={<Home />} />
						</Routes>
					</main>
				}
			</div>
		</Router>
	);
};