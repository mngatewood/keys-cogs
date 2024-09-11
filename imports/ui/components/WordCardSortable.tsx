import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from './Game';

export const WordCardSortable = (card: Card) => {
	const keywords = card.words;

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div className='word-card' id={card._id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<div className='card-word card-top'>{keywords[0]}</div>
			<div className='card-word card-left'>{keywords[3]}</div>
			<div className='card-word card-center'></div>
			<div className='card-word card-right'>{keywords[1]}</div>
			<div className='card-word card-bottom'>{keywords[2]}</div>
		</div>
}