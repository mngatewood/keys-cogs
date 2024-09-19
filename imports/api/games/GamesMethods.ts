import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { GamesCollection, GamesCollectionSchema } from './GamesCollection';


Meteor.methods({
	async 'games.insert'(host: string) {
		check(host, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const game = {
			round: 0,
			started: false,
			completed: false,
			cards: [],
			players: [
				{
					_id: host,
					keys: [],
					cards: [],
					results: []
				}
			]
		};

		GamesCollectionSchema.validate(game);
		if (GamesCollectionSchema.isValid()) {
			const gameId = GamesCollection.insertAsync(game);
			return gameId;
		} else {
			console.log("invalid game", game, GamesCollectionSchema.validationErrors())
		}
	},

	async 'games.get'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		return game;
	}

});
