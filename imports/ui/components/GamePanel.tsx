import React from 'react';

interface GamePanelProps {
	puzzleTitle: string
}

export const GamePanel = ({puzzleTitle }: GamePanelProps) => {

	return (
		<div className='game-panel'>
			<div className="game-panel-title">
				{ puzzleTitle }
			</div>
		</div>
	);
}
