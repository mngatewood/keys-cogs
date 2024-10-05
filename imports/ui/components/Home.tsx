import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { logoutDemoUser, getDemo } from '/imports/helpers/utils';

export const Home = () => {

	const user = useTracker(() => Meteor.user());
	const navigate = useNavigate();

	useEffect(() => {
		if (Meteor.user()) {
			logoutDemoUser();
		}
	}, [])

	const playDemo = async () => {
		const demo = await getDemo();
		Meteor.loginWithPassword(demo.demoPlayer.username, demo.demoPlayer.password, (error) => {
			if (error) {
				console.log(error);
			} else if (demo.demoGame.players.map((player: { _id: string })=> player._id).includes(demo.demoPlayer._id)) {
				localStorage.setItem("gameId", demo.demoGame._id);
				navigate("/play");
			}
		})
	}

	return (
		<>
			<div className="home-container">
				<h1 className="text-2xl font-bold text-center mb-4">Welcome to Keys & Cogs!</h1>
				<p><em><strong>Keys and Cogs</strong></em> is a digital reimplementation of the popular game <em>So Clover!</em>  &nbsp;The rules are simple:</p>
				<p>All players are dealt five cards, each containing four common words (one on each side of the card). In the initial round, everyone will simultaneously arrange four of their the cards in a 2 x 2 grid, known as the <em>cog</em>.  The goal is to put words with a common feature, known as the <em>key</em>, together next to each other.</p>
				<img src="/figure-1.png" alt="overview-figure-1" />
				{/* figure */}
				<p>For example, in the figure below, the player has placed two cards with the words <em>Sheep</em> and <em>Clothing</em> next to each other.</p>
				<img src="/figure-2.png" alt="overview-figure-2" />
				{/* figure */}
				<p>The player then enters a one-word clue that reflects the relationship between the two words.  Here, the player has chosen the word <em>Wool</em>.</p>
				<img src="/figure-3.png" alt="overview-figure-3" />
				{/* figure */}
				<p>Players continue arranging their cards in this manner until four cards have been placed in the cog and each side of the cog contains a key.</p>
				<img src="/figure-4.png" alt="overview-figure-4" />
				<p>Once all players have completed the initial round, your cog and cards are passed to another player.  The other player will see the keys you entered, but the cards will be shuffled.  Everyone scores points by arranging the cards in the correct slots, using the keys as clues.</p>
				<p>When you think you have solved the cog, click the <em>Solve</em> button.</p>
				<img src="/figure-5.png" alt="overview-figure-5" className="small-img"/>
				<p>The app will remove any incorrect cards (due either to the wrong position or wrong rotation).  If you didn't get it perfect on the first try, don't worry.  You will be given a second opportunity to place the correct cards in the empty slots.</p>
				<p>Players score one point for each correctly positioned card, for a maximum score of four.  However, if you guess correctly on the first attempt, you will also score two bonus points.</p>
				<p>Once all players have either solved the cog or made two attempts, your score for the round will be displayed and another round begins.  Every player will have an opportunity to try to solve every other player's cog.</p>
				<p>Once all rounds have been completed, the final scores will be displayed, the winner will be declared, and the game will end.</p>
				<p>When you've gathered 2-6 total players (including yourself), <a href="/register">create an account</a> and <a href="/login">log in</a>.  Once you're logged in, you'll see a play button in the header, which can be clicked to begin.  If you just want to check it out without the fuss, you can play the demo alone without creating an account.</p>
				<p>Enjoy!</p>
				<button onClick={playDemo} className = "w-full mx-auto max-w-sm flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">Play the Demo</button>
			</div>
		</>
	);
};