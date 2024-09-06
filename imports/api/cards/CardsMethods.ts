import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CardsCollection } from './CardsCollection';

Meteor.methods({
	'cards.getRandom'(quantity: number) {
			
		check(quantity, Number);

		const ids = CardsCollection.find({}).map((card) => card._id);
		const shuffled = ids.sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, quantity);
		console.log(selected)
		return selected


	}	

});