import { Meteor } from "meteor/meteor";
import { GamesCollection } from "../GamesCollection";

Meteor.publish("games", () => {
	return GamesCollection.find();
});

Meteor.publish("games.pending", () => {
	return GamesCollection.find({
		$and: [
			{ started: false },
			{ completed: false }
		]
	});
})