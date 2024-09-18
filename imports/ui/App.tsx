import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { CardsCollection } from '../api/cards/CardsCollection';
import { Game } from './components/Game';
import { Login } from './components/Login';
import { Register } from './components/Register';

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
		<div>
			{/* < Register /> */}
			{user ? <Game /> : <Login />}
		</div>
	);
};