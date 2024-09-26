import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from "simpl-schema";

export const GamesCollection = new Mongo.Collection('games');

export const GamesCollectionSchema = new SimpleSchema({
	hostId: {
		type: String,
	},
	started: {
		type: Boolean,
		defaultValue: false
	},
	completed: {
		type: Boolean,
		defaultValue: false
	},
	round: {
		type: Number,
		defaultValue: 0,
		min: 0,
	},
	players: {
		type: Array
	},
	cards: {
		type: Array
	},
	createdAt: {
		type: Number,
	},
	updatedAt: {
		type: Number,
		autoValue: function() {
			return new Date().valueOf();
		}
	},

	"players.$": {
		type: Object,
	},
	"players.$._id": {
		type: String,
	},
	"players.$.ready": {
		type: Boolean,
		defaultValue: false
	},

	"players.$.keys": {
		type: Array
	},
	"players.$.keys.$": {
		type: String,
		required: false,
	},

	"players.$.cards": {
		type: Array
	},
	"players.$.cards.$": {
		type: Object,
		required: false,
	},
	"players.$.cards.$.position": {
		type: Number,
		defaultValue: 1,
		min: 1,
		max: 5
	},
	"players.$.cards.$.rotation": {
		type: Number,
		defaultValue: 0,
		min: -0.75, 
		max: 0.75
	},

	"players.$.results": {
		type: Array
	},
	"players.$.results.$": {
		type: Object,
		required: false,
	},
	"players.$.results.$.round": {
		type: Number,
		defaultValue: 0,
		min: 0
	},
	"players.$.results.$.score": {
		type: Number,
		defaultValue: 0,
		min: 0
	},
	"players.$.results.$.playerId": {
		type: String,
	},

	"players.$.results.$.keys": {
		type: Array
	},
	"players.$.results.$.keys.$": {
		type: String
	},

	"players.$.results.$.cards": {
		type: Array
	},
	"players.$.results.$.cards.$": {
		type: Object
	},
	"players.$.results.$.cards.$.position": {
		type: Number,
		defaultValue: 1,
		min: 1,
		max: 5
	},
	"players.$.results.$.cards.$.rotation": {
		type: Number,
		defaultValue: 0,
		min: -0.75, 
		max: 0.75
	},

	"cards.$": {
		type: Object,
		required: false,
	},
	"cards.$.position": {
		type: Number,
		defaultValue: 1,
		min: 1,
		max: 5
	},
	"cards.$.rotation": {
		type: Number,
		defaultValue: 0,
		min: -0.75, 
		max: 0.75
	},
},

{
	clean: {
		autoConvert: false,
		extendAutoValueContext: {
			userId: function() {
				return Meteor.userId();
			}
		},
		filter: false,
		getAutoValues: true,
		removeEmptyStrings: false,
		removeNullsFromArrays: true,
		trimStrings: true,
	},
	humanizeAutoLabels: false,
	requiredByDefault: true,
}).newContext();
