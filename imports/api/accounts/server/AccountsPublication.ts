import { Meteor } from 'meteor/meteor'

Meteor.publish('users.user', function () {
	return Meteor.users.find(this.userId, {
		fields: {
			_id: 1,
			createdAt: 1,
			username: 1,
			emails: 1,
			firstName: 1,
			lastName: 1,
		}
	});
});