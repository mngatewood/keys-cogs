import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import type { GameType } from '../../api/types';

interface GameResultsProps {
	game: GameType
}

export const GameResults: React.FC<GameResultsProps> = ({game}) => {
	const [results, setResults] = useState([]);

	useEffect(() => {

		const getGameResultsData = async () => {
			const results = await Meteor.callAsync("game.getResults", game._id);
			console.log("game results", results);
			setResults(results);
		}

		getGameResultsData();

	}, [game]);

	return (
		<div className="game-results">
			{ results.length &&
				<>
					<h1 className="text-center text-lg mb-4">Results</h1>
					{results.map((result: any) => {
						return (
							<div className="mb-4"key={result.playerId}>
								<p>Player: {result.playerId}</p>
								<p>Attempts: {result.totalAttempts}</p>
								<p>Score: {result.totalScore}</p>
							</div>
						)
					})}
					{/* <button onClick={exitGame}>Exit</button> */}
				</>
			}
		</div>
	);
}