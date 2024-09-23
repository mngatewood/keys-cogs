import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CardsCollection } from './CardsCollection';


Meteor.methods({
	async 'cards.getRandom'(quantity: number) {
		check(quantity, Number);

		if (!Meteor.userId()) {
			throw new Meteor.Error('not authorized', 'You are not authorized to perform this operation.  Please log in.');
		}

		const cards = await CardsCollection.find({}).fetchAsync();
		const ids = cards.map((card) => card._id);
		const shuffled = ids.sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, quantity);
		return selected
	}	

});
