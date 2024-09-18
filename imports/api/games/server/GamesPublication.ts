import { Meteor } from "meteor/meteor";
import { GamesCollection } from "../GamesCollection";

Meteor.publish("games", () => {
	return GamesCollection.find();
});