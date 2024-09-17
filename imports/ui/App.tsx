import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Game } from './components/Game';
import { Login } from './components/Login';

export const App = () => {
	const user = useTracker(() => Meteor.user());

	return (
		<div>
			{user ? <Game /> : <Login />}
		</div>
	);
};