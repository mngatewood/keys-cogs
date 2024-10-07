import React from 'react';
import type { CardType } from '../../api/types';

interface WordCardSolutionProps {
	card: CardType,
	correct: boolean
}

export const WordCardSolution: React.FC<WordCardSolutionProps> = ({card, correct}) => {
	const keywords = (card as any).words;

	return (
		<div className='word-card-wrapper' id={card._id} >
			<div className="word-card" style={{ transform: `rotate(${card.rotation}turn)`}}>
				<div className='card-word card-top'>{keywords[0]}</div>
				<div className='card-word card-left'>{keywords[3]}</div>
				{correct 
					? <div className='card-word card-center'></div>
					: <div className='card-word card-center incorrect-card'>
						<img className='card-img card-img-incorrect' src='/incorrect-icon.png' />
					</div>
				}
				<div className='card-word card-right'>{keywords[1]}</div>
				<div className='card-word card-bottom'>{keywords[2]}</div>
			</div>
		</div>
	)
}