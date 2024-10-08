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
		const demoGameData = {
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
					cogBonus: 0,
					keys: ["", "", "", ""],
					cards: [],
					results: []
				},
				{
					_id: demoAccounts.demoOpponentId,
					ready: true,
					round: 0,
					cogBonus: 0,
					keys: ["", "", "", ""],
					cards: [],
					results: [
						{
							round: 1,
							attempts: 0,
							score: 0
						}
					]
				}
			],
			createdAt: new Date().valueOf(),
			updatedAt: new Date().valueOf()
		}

		GamesCollectionSchema.validate(demoGameData);

		if (!GamesCollectionSchema.isValid()) {
			throw new Error("Invalid demo game data");
		}
			
		const demoGameId = await GamesCollection.insertAsync(demoGameData)
		const demoGame = await GamesCollection.findOneAsync(demoGameId);
		const allCardsSeeded = await CardsCollection.find().countAsync() === 220;

		if (demoGame && allCardsSeeded) {
			console.log("demo game inserted, updating game")
			const playerCard1 = await CardsCollection.findOneAsync({ words: "Sheep" })
			const playerCard2 = await CardsCollection.findOneAsync({ words: "Clothing" })
			const playerCard3 = await CardsCollection.findOneAsync({ words: "Bakery" })
			const playerCard4 = await CardsCollection.findOneAsync({ words: "Boxing" })
			const playerCard5 = await CardsCollection.findOneAsync({ words: "Card" })
			const opponentCard1 = await CardsCollection.findOneAsync({ words: "Accessory" })
			const opponentCard2 = await CardsCollection.findOneAsync({ words: "Adventure" })
			const opponentCard3 = await CardsCollection.findOneAsync({ words: "Bomb" })
			const opponentCard4 = await CardsCollection.findOneAsync({ words: "Ammo" })
			const opponentCard5 = await CardsCollection.findOneAsync({ words: "Advocate" })
			const playerCards = [
				{
					_id: playerCard1?._id,
					words: playerCard1?.words,
					position: 5,
					rotation: 0
				},
				{
					_id: playerCard2?._id,
					words: playerCard2?.words,
					position: 5,
					rotation: 0
				},
				{
					_id: playerCard3?._id,
					words: playerCard3?.words,
					position: 5,
					rotation: 0
				},
				{
					_id: playerCard4?._id,
					words: playerCard4?.words,
					position: 5,
					rotation: 0
				},
				{
					_id: playerCard5?._id,
					words: playerCard5?.words,
					position: 5,
					rotation: 0
				},
			];
			const opponentCards = [
				{
					_id: opponentCard1?._id,
					words: opponentCard1?.words,
					position: 1,
					rotation: 0.25
				},
				{
					_id: opponentCard2?._id,
					words: opponentCard2?.words,
					position: 2,
					rotation: 0
				},
				{
					_id: opponentCard3?._id,
					words: opponentCard3?.words,
					position: 3,
					rotation: 0.75
				},
				{
					_id: opponentCard4?._id,
					words: opponentCard4?.words,
					position: 4,
					rotation: 0.75
				},
				{
					_id: opponentCard5?._id,
					words: opponentCard5?.words,
					position: 5,
					rotation: 0
				},
			]
			const opponentKeys = ["liftoff", "valentine", "silence", "countdown"]
			const update = {
				$set: {
					cards: [...playerCards, ...opponentCards],
					"players.$[opponent].keys": opponentKeys,
					"players.$[player].cards": playerCards,
					"players.$[opponent].cards": opponentCards,
				},
			}
			const options: any = {
				arrayFilters: [
					{ "opponent._id": demoAccounts.demoOpponentId },
					{ "player._id": demoAccounts.demoPlayerId },
				]
			};

			const updatedDemoGame = await GamesCollection.updateAsync(demoGame._id, update, options);

			if (updatedDemoGame) {
				console.log("successfully updated demo game");		
			}
		}

	}
});
