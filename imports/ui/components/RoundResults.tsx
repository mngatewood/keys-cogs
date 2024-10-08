import React, { useEffect, useState } from "react";
import type { RoundResultsType } from "../../api/types";
import { Droppable } from "./Droppable";
import { WordCardSolution } from "./WordCardSolution";

type RoundResultsProps = {
	roundResults: RoundResultsType
}

export const RoundResults: React.FC<RoundResultsProps> = ({roundResults}) => {
	const [solutionCards, setSolutionCards] = useState<React.JSX.Element[]>([]);
	
	useEffect(() => {
		console.log("roundResults", roundResults)
		const sortedCards = roundResults.solution?.sort((a, b) => a.position - b.position);
		if (!sortedCards) return;
		setSolutionCards(sortedCards.map((card) => {
			const correct = !roundResults.incorrectPositions?.includes(card.position.toString());
			console.log("correct positions", roundResults.incorrectPositions, card.position)
			return <WordCardSolution key={card._id} card={card} correct={correct}/>
		}));
	}, [roundResults]);

	return (
		<div className="flex flex-col justify-evenly items-center bg-white shadow-lg border border-gray-300 rounded-lg px-4 py-6 mb-4 w-full max-w-md">
			<h1 className="text-2xl font-bold text-center mb-4">
				{ roundResults.message }
			</h1>
			<div className="solved-cog-container">
				<div className="key cog-top key-1">{roundResults?.keys?.[0]}</div>
				<div className="key cog-right key-2">{roundResults?.keys?.[1]}</div>
				<div className="key cog-bottom key-3">{roundResults?.keys?.[2]}</div>
				<div className="key cog-left key-4">{roundResults?.keys?.[3]}</div>
				<div className="solved-cards-container">
					{solutionCards.map((card) => (
						<Droppable
							key={card.key ?? ""}
							id={card.key ?? ""}
						>
							{card}
						</Droppable>
					))}
				</div>
			</div>
			{roundResults.roundComplete && roundResults.incorrectPositions &&
				<>
					<div className="flex justify-between items-center w-full font-bold">
						<div className="flex flex-col items-start">
							<h3 className="my-2">Correct Cards:</h3>
							<h3 className="my-2">Number of Attempts:</h3>
							<h3 className="my-2">Round Score:</h3>
						</div>
						<div className="flex flex-col items-end">
							<h3 className="my-2">{4 - roundResults.incorrectPositions?.length}</h3>
							<h3 className="my-2">{roundResults.attempts}</h3>
							<h3 className="my-2">{roundResults.score}</h3>
						</div>
					</div>
				</>
			}
		</div>
	)
}
