import React from 'react';
import type { RoundResults } from '../../api/types';

interface WaitingOverlayProps {
	allPlayersReady: Function,
	advanceRound: Function,
	roundResults: RoundResults,
}

export const WaitingOverlay = ({allPlayersReady, advanceRound, roundResults}: WaitingOverlayProps) => {

	const handleAdvanceRound = () => {
		advanceRound();
	}

	return (
		<div className="h-screen w-full fixed top-0 left-0 flex items-center justify-center z-50 bg-blue-1 bg-opacity-50 ">
			<div className="bg-white shadow-lg border border-gray-300 rounded-lg px-8 py-6 w-5/6 max-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">
					{ allPlayersReady() ? "All players ready" : roundResults.message }
				</h1>
				{roundResults.roundComplete && roundResults.incorrectPositions &&
					<>
						<h3 className="text-2xl font-bold text-center mb-4">Correct: { 4 - roundResults.incorrectPositions?.length }</h3>
						<h3 className="text-2xl font-bold text-center mb-4">Attempts: {roundResults.attempts }</h3>
						<h3 className="text-2xl font-bold text-center mb-4">Score: {roundResults.score}</h3>
					</>
				}
				<button disabled={!allPlayersReady()} onClick={handleAdvanceRound} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Start Next Round
				</button>
			</div>
		</div>
	)
}
