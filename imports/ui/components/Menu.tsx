import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { getDemo } from '/imports/helpers/utils';

interface MenuProps {
	joinGame: Function,
	showGames: Function
}

export const Menu: React.FC<MenuProps> = ({joinGame, showGames}) => {

	const user = useTracker(() => Meteor.user());

	const handleHostGame = () => {
		Meteor.callAsync("games.insert", user?._id).then((result) => {
			joinGame(result);
		});
	}

	const handleListGames = () => {
		showGames();
	}

	const playDemo = async () => {
		const demo = await getDemo();
		Meteor.loginWithPassword(demo.demoPlayer.username, demo.demoPlayer.password, (error) => {
			if (error) {
				console.log(error);
			} else if (demo.demoGame.players.map((player: { _id: string }) => player._id).includes(demo.demoPlayer._id)) {
				localStorage.setItem("gameId", demo.demoGame._id);
				// navigate("/play");
			}
		})
	}


	return (
		<>
			<div className="flex items-center justify-center overflow-scroll w-full h-full">
				<div className="bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto max-w-md w-5/6">
					<h1 className="text-2xl font-bold text-center mb-4">Ready to begin?</h1>
					<h3 className="text-lg font-bold text-center mb-4">Click "Host a Game" to start a new game or "Join a Game" to join an existing game.</h3>
					<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleHostGame}>
						Host a Game
					</button>
					<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={handleListGames}>
						Join a Game
					</button>
					<button className="button w-full flex justify-center my-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1" onClick={playDemo}>
						Play the Demo
					</button>
				</div>
			</div>
		</>
	);
};