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
			hostId: Meteor.userId(),
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
		if (game) {
			return game;
		} else {
			throw new Meteor.Error('game-not-found');
		}
	},

	async 'game.complete'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		console.log("completing game", game)
		if (game) {
			const update = {
				$set: {
					completed: true
				}
			}
			const response = await GamesCollection.updateAsync(gameId, update);
			if (response === 1) {
				game.completed = true
				return game;
			} else {
				throw new Meteor.Error('unable-to-complete-game');
			}
		} else {
			throw new Meteor.Error('game-not-found');
		}
	},

	async 'game.start'(gameId: string) {
		check(gameId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const game = await GamesCollection.findOneAsync({_id: gameId});
		console.log("starting game", game)
		if (game) {
			const update = {
				$set: {
					started: true
				}
			}
			const response = await GamesCollection.updateAsync(gameId, update);
			if (response === 1) {
				game.started = true
				return game;
			} else {
				throw new Meteor.Error('unable-to-start-game');
			}
		} else {
			throw new Meteor.Error('game-not-found');
		}
	}

});
