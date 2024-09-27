import React from 'react';

export const WaitingOverlay = () => {
	return (
		<div className="h-screen w-full fixed top-0 left-0 flex items-center justify-center z-50 bg-purple-500 bg-opacity-50 ">
			<div className="bg-white shadow-lg border border-gray-300 rounded-lg px-8 py-6 w-5/6 max-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Waiting for other players...</h1>
			</div>
		</div>
	)
}
