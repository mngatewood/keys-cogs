import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import type { GameType } from '../../api/types';

interface GameResultsProps {
	game: GameType
	exitGame: Function
}

export const GameResults: React.FC<GameResultsProps> = ({game, exitGame}) => {
	const [playerResults, setPlayerResults] = useState<{ _id: string, totalScore: number, totalAttempts: number, bonusScores: number }[]>([]);
	const [medals, setMedals] = useState<{ gold: string, silver: string, bronze: string }>({ gold: "", silver: "", bronze: "" });

	useEffect(() => {

		const getGameResultsData = async () => {
			let results = await Meteor.callAsync("game.getResults", game._id);
			results.sort((a: any, b: any) => {
				return b.totalScore - a.totalScore || 
				a.totalAttempts - b.totalAttempts || 
				b.cogBonus - a.cogBonus ||
				b.bonusScores - a.bonusScores
			})
			setPlayerResults(results);
			getMedals(results);

		}

		getGameResultsData();

	}, [game]);

	const getMedals = (results: { _id: string }[]) => {
		if (!results.length) return;
		const medalCount = results.length > 3 ? 3 : results.length -1;
		let updatedMedals = {
			gold: "",
			silver: "",
			bronze: ""
		};
		for (let i = 0; i < medalCount; i++) {
			if (i === 0) {
				updatedMedals.gold = results[i]._id;
			} else if (i === 1) {
				updatedMedals.silver = results[i]._id;
			} else if (i === 2) {
				updatedMedals.bronze = results[i]._id;
			}
		}

		setMedals(updatedMedals);
	}

	const getMyMedal = (playerId: string) => {
		let medal = "";
		Object.keys(medals).forEach((key) => {
			if (medals[key as keyof typeof medals] === playerId) {
				medal = key
			};
		});
		return medal
	}

	const handleExitGame = () => {
		exitGame();
	}

	return (
		<div className="flex flex-col items-center justify-evenly w-full h-full">
			<h1 className="game-panel-title">Game Summary</h1>
			{ playerResults.length &&
				<>
					<div className="flex items-center justify-center w-full">
						<div className="bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 w-5/6 max-w-md">
							<h1 className="text-2xl font-bold text-center mb-4">Results</h1>
							<ul>
								{playerResults.map((player: any) => {
									return (
										<li key={player._id} id={player._id} data-medal={getMyMedal(player._id)} className="game-card rounded-lg bg-white border border-gray-300 shadow-md my-4">
											<div className="flex flex-col px-4 pb-4 sm:px-6">
												<div className="flex items-start justify-between text-base font-bold text-gray-900">
													<h3 className="mt-2">{player.name}:</h3>
													<h3 className="mt-2 text-center">{player.totalScore + player.cogBonus} points</h3>
													{getMyMedal(player._id) &&
														<img className="h-8 w-8" src={`/${getMyMedal(player._id)}-medal-icon.png`} />
													}
												</div>
												<hr className="my-2" />
												<div className="flex items-start justify-between">
													<div className="flex flex-col justify-start items-start font-bold">
														<h3>Round</h3>
														<h3>Attempts</h3>
														<h3>Score</h3>
													</div>
													{ player.results.map((result: any) => {
														return (
															<div key={player._id + result.round} className="flex flex-col justify-center items-end">
																<h3 className="font-bold">{result.round}</h3>
																<h3>{result.attempts}</h3>
																<h3>{result.score}</h3>
															</div>
														)
													})}
													<div className="flex flex-col justify-center items-end font-bold">
														<h3>Total</h3>
														<h3>{player.totalAttempts}</h3>
														<h3>{player.totalScore}</h3>
													</div>
												</div>
												<hr className="my-2" />
												<div className="flex items-center justify-between text-sm font-bold">
													<h3>Cog Bonus</h3>
													<h3>{player.cogBonus}</h3>
												</div>
											</div>
										</li>
									)
								})}
							</ul>
							<button onClick={handleExitGame} className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1'>Exit</button>
						</div>
					</div>
				</>
			}
		</div>
	);
}