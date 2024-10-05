import { Meteor } from "meteor/meteor";

export const debounce = (func: any, wait = 100) => {
	let timeout: NodeJS.Timeout | null = null;
	return function (event: Event) {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(func, wait, event);
	};
};

export const logoutDemoUser = async () => {
	const demoGame = await Meteor.callAsync("games.getDemo");
	const demoGamePlayers = demoGame.players.map((player: any) => player._id);
	if (demoGamePlayers.includes(Meteor.userId())) {
		Meteor.logout();
	}
}

export const getDemo = async () => {
	if (Meteor.user()) {
		Meteor.logout();
	}

	const demoPlayer = await Meteor.callAsync("accounts.getDemoPlayer");
	const demoGame = await Meteor.callAsync("games.getDemo");

	return { demoPlayer, demoGame };
}
