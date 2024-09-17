import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { WordsCollection } from '/imports/api/words/WordsCollection';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { words, cards } from '/server/seedData';

const SEED_USERNAME = 'admin@gmail.com';
const SEED_USEREMAIL = 'admin@gmail.com';
const SEED_PASSWORD = 'password';

const insertWord = (word: string) => WordsCollection.insertAsync({ text: word });
const insertCard = (card: Array<string>) => CardsCollection.insertAsync({ words: card });

Meteor.startup(async() => {
	console.log("startup")

	if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
		Accounts.createUser({
			username: SEED_USERNAME,
			password: SEED_PASSWORD,
			email: SEED_USEREMAIL
		});

	if (await WordsCollection.find().countAsync() === 0) {
		console.log("inserting words")
		words.forEach(insertWord)
	}

	if (await CardsCollection.find().countAsync() === 0) {
		console.log("inserting cards");
		cards.forEach(insertCard);
		// await Promise.all(cards.map(async (card) => {
		// 	const wordIdArray = await Promise.all(card.map(async (word) => {
		// 		const record = await WordsCollection.findOneAsync({ text: word });
		// 		if (record) {
		// 			return record._id;
		// 		}
		// 	}));
		// 	insertCard(wordIdArray);
		// }));
	}
	// Meteor.publish("words", function () {
	// 	console.log("publishing words");
	// 	console.log(WordsCollection.find().count())
	// 	return WordsCollection.find();
	// });

	
});
