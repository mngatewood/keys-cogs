import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import type { Card } from './Game';

interface WordCardDraggableProps {
	card: Card
	addCard: Function
}

export const WordCardDraggable: React.FC<WordCardDraggableProps> = ({card, addCard}) => {
	const keywords = (card as any).words;

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: card._id,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
	}

	return (
		<div className='word-card-wrapper' id={card._id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<div className="word-card">
				<div className='card-word card-top'>{keywords[0]}</div>
				<div className='card-word card-left'>{keywords[3]}</div>
				<div className='card-word card-center'></div>
				<div className='card-word card-right'>{keywords[1]}</div>
				<div className='card-word card-bottom'>{keywords[2]}</div>
			</div>
			<div className="card-panel">
				<div className='card-panel-buttons-container'>
					<button className='card-button remove-button' onClick={() => addCard(card._id)}>
						<img className='card-img' src='/add-icon.png' />
					</button>
				</div>
			</div>
		</div>
}