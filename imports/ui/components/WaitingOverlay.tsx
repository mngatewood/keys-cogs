import React from 'react';

interface WaitingOverlayProps {
	allPlayersReady: Function,
	advanceRound: Function
}

export const WaitingOverlay = ({allPlayersReady, advanceRound}: WaitingOverlayProps) => {

	const handleAdvanceRound = () => {
		advanceRound();
	}

	return (
		<div className="h-screen w-full fixed top-0 left-0 flex items-center justify-center z-50 bg-purple-500 bg-opacity-50 ">
			<div className="bg-white shadow-lg border border-gray-300 rounded-lg px-8 py-6 w-5/6 max-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">
					{allPlayersReady() ? "All players ready" : "Waiting for other players..."}
				</h1>
				<button onClick={handleAdvanceRound} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Start Next Round
				</button>
			</div>
		</div>
	)
}
