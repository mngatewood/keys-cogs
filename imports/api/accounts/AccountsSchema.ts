import SimpleSchema from "simpl-schema";

export const AccountsSchema = new SimpleSchema({
	firstName: {
		type: String
	},
	lastName: {
		type: String,
		required: false
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	}
}).newContext();

