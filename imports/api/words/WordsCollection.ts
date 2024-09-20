import { Mongo } from 'meteor/mongo';
import SimpleSchema from "simpl-schema";

export const WordsCollection = new Mongo.Collection('words');

export const WordsCollectionSchema = new SimpleSchema({
	text: {
		type: String
	},
}).newContext();
