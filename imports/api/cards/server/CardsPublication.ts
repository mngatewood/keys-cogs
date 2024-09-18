import { Meteor } from "meteor/meteor";
import { CardsCollection } from "../CardsCollection";

Meteor.publish("cards", () => {
	return CardsCollection.find();
});