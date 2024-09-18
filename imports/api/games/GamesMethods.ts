import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { GamesCollection } from './GamesCollection';


Meteor.methods({
	async 'games.insert'(host: string) {
		check(host, string);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		
		console.log("inserting game", host);
	}

});
