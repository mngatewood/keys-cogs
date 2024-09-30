import { Meteor } from 'meteor/meteor';

// Meteor methods
import "../imports/startup/server/index";

// Collections
import { WordsCollection, WordsCollectionSchema } from '/imports/api/words/WordsCollection';
import { CardsCollection, CardsCollectionSchema } from '/imports/api/cards/CardsCollection';
import { GamesCollection, GamesCollectionSchema } from '/imports/api/games/GamesCollection';
import { AccountsSchema } from '/imports/api/accounts/AccountsSchema';

// Seed Data
import { words, cards } from '/server/seedData';

const settings = Meteor.settings.private;

const playerFirstName = settings.DEMO_PLAYER_FIRST_NAME;
const playerLastName = settings.DEMO_PLAYER_LAST_NAME;
const playerEmail = settings.DEMO_PLAYER_EMAIL;
const playerPassword = settings.DEMO_PLAYER_PASSWORD;
const opponentFirstName = settings.OPPONENT_PLAYER_FIRST_NAME;
const opponentLastName = settings.OPPONENT_PLAYER_LAST_NAME;
const opponentEmail = settings.OPPONENT_PLAYER_EMAIL;
const opponentPassword = settings.OPPONENT_PLAYER_PASSWORD;

const insertWord = (word: string) => WordsCollection.insertAsync({ text: word });
const insertCard = (card: Array<string>) => CardsCollection.insertAsync({ words: card });

Meteor.startup(async() => {
	console.log("startup")

	if (await WordsCollection.find().countAsync() === 0) {
		console.log("inserting words")
		words.forEach((word) => {
			WordsCollectionSchema.validate({text: word});
			if (WordsCollectionSchema.isValid()) {
				insertWord(word);
			} else {
				console.log("invalid word", word)
			}
		})
	}

	if (await CardsCollection.find().countAsync() === 0) {
		console.log("inserting cards");
		cards.forEach((card) => {
			CardsCollectionSchema.validate({words: card});
			if (CardsCollectionSchema.isValid()) {
				insertCard(card);
			} else {
				console.log("invalid card", card)
			}
		});
	}

	const getDemoAccounts = async () => {

		let demoPlayerId, demoOpponentId;

		const existingDemoPlayer = await Meteor.users.findOneAsync({ username: playerEmail });

		if (existingDemoPlayer) {
			demoPlayerId = existingDemoPlayer._id;
		} else {
			const newDemoPlayerData = {
				firstName: playerFirstName,
				lastName: playerLastName,
				username: playerEmail,
				password: playerPassword,
				email: playerEmail
			}

			AccountsSchema.validate(newDemoPlayerData);
			if (AccountsSchema.isValid()) {
				console.log("inserting demo player")
				demoPlayerId = await Meteor.callAsync("accounts.insert",
					newDemoPlayerData.firstName,
					newDemoPlayerData.lastName,
					newDemoPlayerData.username,
					newDemoPlayerData.email,
					newDemoPlayerData.password
				)
			}
		}

		const existingDemoOpponent = await Meteor.users.findOneAsync({ username: opponentEmail });

		if (existingDemoOpponent) {
			demoOpponentId = existingDemoOpponent._id;
		} else {
			const newDemoOpponentData = {
				firstName: opponentFirstName,
				lastName: opponentLastName,
				username: opponentEmail,
				password: opponentPassword,
				email: opponentEmail
			}

			AccountsSchema.validate(newDemoOpponentData);
			if (AccountsSchema.isValid()) {
				console.log("inserting demo opponent")
				demoOpponentId = await Meteor.callAsync("accounts.insert",
					newDemoOpponentData.firstName,
					newDemoOpponentData.lastName,
					newDemoOpponentData.username,
					newDemoOpponentData.email,
					newDemoOpponentData.password
				)
			}
		}

		if (demoPlayerId && demoOpponentId) {
			return {
				demoPlayerId: demoPlayerId,
				demoOpponentId: demoOpponentId
			}
		} else {
			return null
		}
	}

	const demoAccounts = await getDemoAccounts();
	const existingDemoGame = await GamesCollection.findOneAsync({ isDemo: true });

	if (!existingDemoGame && demoAccounts) {
		console.log("inserting demo game");
		const demoGame = {
			hostId: demoAccounts.demoOpponentId,
			started: true,
			completed: false,
			round: 0,
			isDemo: true,
			cards: [],
			players: [
				{
					_id: demoAccounts.demoPlayerId,
					ready: false,
					round: 0,
					keys: ["", "", "", ""],
					cards: [],
					results: []
				},
				{
					_id: demoAccounts.demoOpponentId,
					ready: true,
					round: 0,
					keys: ["", "", "", ""],
					cards: [],
					results: []
				}
			],
			createdAt: new Date().valueOf(),
			updatedAt: new Date().valueOf()
		}

		GamesCollectionSchema.validate(demoGame);

		if (GamesCollectionSchema.isValid()) {
			GamesCollection.insertAsync(demoGame).then((result: string) => {
				console.log("insert demo game result", result)
			}).catch((error: Meteor.Error) => {
				console.log("error", error)
			});
		} else {
			console.log("invalid demo game", demoGame)
		}
	}
});
