import { Meteor } from 'meteor/meteor';

// Meteor methods
import "../imports/startup/server/index";

// Collections
import { WordsCollection, WordsCollectionSchema } from '/imports/api/words/WordsCollection';
import { CardsCollection, CardsCollectionSchema } from '/imports/api/cards/CardsCollection';
import { GamesCollection, GamesCollectionSchema } from '/imports/api/games/GamesCollection';
import { Accounts } from 'meteor/accounts-base';
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

	let demoPlayerId, demoOpponentId;

	if (!(await Accounts.findUserByUsername(playerEmail))) {
		const demoPlayer = {
			firstName: playerFirstName,
			lastName: playerLastName,
			username: playerEmail,
			password: playerPassword,
			email: playerEmail
		}
		AccountsSchema.validate(demoPlayer);
		if (AccountsSchema.isValid()) {
			console.log("inserting demo player")
			Meteor.callAsync("accounts.insert", 
				demoPlayer.firstName, 
				demoPlayer.lastName, 
				demoPlayer.username,
				demoPlayer.email, 
				demoPlayer.password
			).then((result) => {
				demoPlayerId = result
				console.log("insert demo player result", result)
			}).catch((error) => {
				console.log("error", error)
			});
		} else {
			console.log("invalid demo player", demoPlayer)
		}
	}

	if (!(await Accounts.findUserByUsername(opponentEmail))) {
		const demoOpponent = {
			firstName: opponentFirstName,
			lastName: opponentLastName,
			username: opponentEmail,
			password: opponentPassword,
			email: opponentEmail
		}
		AccountsSchema.validate(demoOpponent);
		if (AccountsSchema.isValid()) {
			console.log("inserting demo opponent")
			Meteor.callAsync("accounts.insert", 
				demoOpponent.firstName, 
				demoOpponent.lastName, 
				demoOpponent.username,
				demoOpponent.email, 
				demoOpponent.password
			).then((result) => {
				demoOpponentId = result;
				console.log("insert demo opponent result", result)
			}).catch((error) => {
				console.log("error", error)
			});
		} else {
			console.log("invalid default user", demoOpponent)
		}
	}

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

	const demoPlayer = await Accounts.findUserByUsername(playerEmail);
	const demoOpponent = await Accounts.findUserByUsername(opponentEmail);
	const cardsReady = await CardsCollection.find().countAsync() === 220;

	if ( demoPlayer && demoOpponent && await GamesCollection.find({isDemo: true}).countAsync() === 0) {
		console.log("inserting demo game");
		const demoGame = {
			hostId: demoOpponent._id,
			started: false,
			completed: false,
			round: 0,
			isDemo: true,
			cards: [],
			players: [
				{
					_id: demoPlayer._id,
					ready: false,
					round: 0,
					keys: ["", "", "", ""],
					cards: []
				},
				{
					_id: demoOpponent._id,
					ready: false,
					round: 0,
					keys: ["", "", "", ""],
					cards: []
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

	const demoGame = await GamesCollection.findOneAsync({ isDemo: true });

	if (demoGame && cardsReady && demoPlayer && demoOpponent) {
		const playerCard1 = await CardsCollection.findOneAsync({words:"Airport"})
		const playerCard2 = await CardsCollection.findOneAsync({words:"Bag"})
		const playerCard3 = await CardsCollection.findOneAsync({words:"Bakery"})
		const playerCard4 = await CardsCollection.findOneAsync({words:"Boxing"})
		const playerCard5 = await CardsCollection.findOneAsync({words:"Card"})
		const opponentCard1 = await CardsCollection.findOneAsync({words:"Accessory"})
		const opponentCard2 = await CardsCollection.findOneAsync({words:"Adventure"})
		const opponentCard3 = await CardsCollection.findOneAsync({words:"Ammo"})
		const opponentCard4 = await CardsCollection.findOneAsync({words:"Bomb"})
		const opponentCard5 = await CardsCollection.findOneAsync({words:"Advocate"})
		const playerCards = [
			{
				_id: playerCard1?._id,
				position: 5,
				rotation: 0
			},
			{
				_id: playerCard2?._id,
				position: 5,
				rotation: 0
			},
			{
				_id: playerCard3?._id,
				position: 5,
				rotation: 0
			},
			{
				_id: playerCard4?._id,
				position: 5,
				rotation: 0
			},
			{
				_id: playerCard5?._id,
				position: 5,
				rotation: 0
			},
		];
		const opponentCards = [
			{
				_id: opponentCard1?._id,
				position: 1,
				rotation: 0.5
			},
			{
				_id: opponentCard2?._id,
				position: 2,
				rotation: 0
			},
			{
				_id: opponentCard3?._id,
				position: 3,
				rotation: 0.75
			},
			{
				_id: opponentCard4?._id,
				position: 4,
				rotation: 0.75
			},
			{
				_id: opponentCard5?._id,
				position: 5,
				rotation: 0
			},
		]
		const opponentKeys = [ "liftoff", "valentine", "silence", "countdown" ]
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
				{ "opponent._id": demoOpponent._id },
				{ "player._id": demoPlayer._id },
			]
		};

		GamesCollection.updateAsync(demoGame._id, update, options).then((result) => {
			console.log("update demo game result", result)
		}).catch((error: Meteor.Error) => {
			console.log("error", error)
		})
	}

});
