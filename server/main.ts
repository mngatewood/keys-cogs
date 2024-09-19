import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { WordsCollection, WordsCollectionSchema } from '/imports/api/words/WordsCollection';
import { CardsCollection, CardsCollectionSchema } from '/imports/api/cards/CardsCollection';
import { AccountsSchema } from '/imports/api/accounts/AccountsSchema';
import { words, cards } from '/server/seedData';

// Meteor methods
import "../imports/startup/server/index";

const SEED_USERNAME = 'admin@gmail.com';
const SEED_USEREMAIL = 'admin@gmail.com';
const SEED_PASSWORD = 'password';

const insertWord = (word: string) => WordsCollection.insertAsync({ text: word });
const insertCard = (card: Array<string>) => CardsCollection.insertAsync({ words: card });

Meteor.startup(async() => {
	console.log("startup")

	if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
		const defaultUser = {
			firstName: "Admin",
			lastName: "User",
			username: SEED_USERNAME,
			password: SEED_PASSWORD,
			email: SEED_USEREMAIL
		}
		AccountsSchema.validate(defaultUser);
		if (AccountsSchema.isValid()) {
			console.log("inserting default user")
			Meteor.callAsync("accounts.insert", 
				defaultUser.firstName, 
				defaultUser.lastName, 
				defaultUser.username,
				defaultUser.email, 
				defaultUser.password
			).then((result) => {
				console.log("result", result)
			}).catch((error) => {
				console.log("error", error)
			});
		} else {
			console.log("invalid default user", defaultUser)
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
	
});
