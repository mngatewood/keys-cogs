import React from 'react';

interface GamePanelProps {
	puzzleTitle: string
	exitGame: Function
}

export const GamePanel = ({puzzleTitle, exitGame}: GamePanelProps) => {

	const handleExitGame = () => {
		exitGame();
	}

	return (
		<div className='game-panel z-top'>
			<div className='w-1/12' />
			<div className="w-10/12">
				<div className="game-panel-title">
					{ puzzleTitle }
				</div>
			</div>
			<button className='flex justify-end w-1/12' onClick={handleExitGame}>
				<img className='exit-img' src='/exit-icon.png' />
			</button>
		</div>
	);
}
