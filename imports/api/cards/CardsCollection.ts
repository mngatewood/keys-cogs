import { Mongo } from 'meteor/mongo';
import SimpleSchema from "simpl-schema";

export const CardsCollection = new Mongo.Collection('cards');

export const CardsCollectionSchema = new SimpleSchema({
	words: {
		type: Array
	},
	"words.$":{
		type: String
	}
}).newContext();
