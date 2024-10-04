import React from 'react';

interface GamePanelProps {
	puzzleTitle: string
}

export const GamePanel = ({puzzleTitle }: GamePanelProps) => {

	return (
		<div className='game-panel z-top'>
			<div className='w-1/12' />
			<div className="w-10/12">
				<div className="game-panel-title">
					{ puzzleTitle }
				</div>
			</div>
		</div>
	);
}
