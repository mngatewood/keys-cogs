import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import type { Card } from './Game';

export const WordCardDraggable = (card: Card) => {
	const keywords = card.words;

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
				
			</div>
		</div>
}