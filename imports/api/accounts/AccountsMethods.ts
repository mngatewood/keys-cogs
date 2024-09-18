import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from 'meteor/check';

Meteor.methods({
	async 'accounts.insert'(firstName: string, lastName: string, email: string, password: string) {
		check(firstName, String);
		check(lastName, String);
		check(email, String);
		check(password, String);

		const options = { firstName, lastName, email, password };
		const userId = await Accounts.createUserAsync(options);

		return userId;
	}
});