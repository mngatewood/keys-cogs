import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from 'meteor/check';

Meteor.methods({
	async 'accounts.insert'(firstName: string, lastName: string, username: string, email: string, password: string) {
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
	},

	async "accounts.getDemoPlayer"() {
		const demoPlayerUsername = Meteor.settings.private.DEMO_PLAYER_EMAIL;
		const password = Meteor.settings.private.DEMO_PLAYER_PASSWORD
		const demoPlayer = await Meteor.users.findOneAsync({username: demoPlayerUsername});

		if (demoPlayer) {
			return {
				_id: demoPlayer._id,
				username: demoPlayer.username,
				password: password,
			}
		} else {
			return null;
		}
	}
});

