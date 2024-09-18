import { Meteor } from "meteor/meteor";
import { CardsCollection } from "../CardsCollection";

Meteor.publish("tasks", () => {
	return CardsCollection.find();
});