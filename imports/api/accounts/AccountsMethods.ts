import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from 'meteor/check';

Meteor.methods({
	async 'accounts.insert'(firstName: string, lastName: string, username: string, email: string, password: string) {
		// console.log("insert", firstName, lastName, username, email, password);
		check(firstName, String);
		check(lastName, String);
		check(username, String);
		check(email, String);
		check(password, String);

		const trimmedFirstName = firstName.trim();
		const trimmedLastName = lastName.trim();
		const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();

		const options = { username:trimmedUsername, email: trimmedEmail, password };
		const userId = await Accounts.createUserAsync(options);
		const update = {
			$set: {
				firstName: trimmedFirstName,
				lastName: trimmedLastName
			}, 
		}

		Meteor.users.updateAsync(userId, update);
		return userId;
	}
});