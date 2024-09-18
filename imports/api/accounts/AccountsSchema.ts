import SimpleSchema from "simpl-schema";

export const AccountsSchema = new SimpleSchema({
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

