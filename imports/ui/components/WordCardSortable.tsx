import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CardType } from '../../api/types';

interface WordCardSortableProps {
	card: CardType,
	removeCard: Function
}

export const WordCardSortable: React.FC<WordCardSortableProps> = ({card, removeCard}) => {
	const keywords = card.words;
	const [turn, setTurn] = useState(0);
	const isPlaceholder = ["1", "2", "3", "4"].includes(card._id);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
		id: card._id,
		transition: { 
			duration: 0,
			easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const rotateCard = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
		const turnIncrement = direction === "clockwise" ? 0.25 : -0.25;
		const turnValue = turn + turnIncrement;
		const cardOuter = (e.target as HTMLElement).closest(".card-panel")?.previousElementSibling;
		(cardOuter as HTMLElement).style.transform = "rotate(" + turnValue + "turn)";
		setTurn(turnValue);
	}

	if(isPlaceholder) {
		return (
			<div className="word-card-placeholder" id={card._id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
				Drop Here
			</div>
		)
	} else {
		return (
			<div className="word-card-wrapper" id={card._id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
				<div className="word-card">
					<div className='card-word card-top'>{keywords[0]}</div>
					<div className='card-word card-left'>{keywords[3]}</div>
					<div className='card-word card-center'></div>
					<div className='card-word card-right'>{keywords[1]}</div>
					<div className='card-word card-bottom'>{keywords[2]}</div>
				</div>
				<div className="card-panel nodrag">
					<div className='card-panel-buttons-container'>
						<button onClick={(event) => rotateCard(event, "counterclockwise")} className='card-button rotate-button'>
							<img className='card-img' src='/counter-clockwise-arrow.png' />
						</button>
						<button onClick={(event) => rotateCard(event, "clockwise")} className='card-button rotate-button'>
							<img className='card-img' src='/clockwise-arrow.png' />
						</button>
					</div>
					<div className='card-panel-buttons-container'>
						<button className='card-button remove-button' onClick={() => removeCard(card._id)}><img className='card-img' src='/minus-icon.png' /></button>
					</div>
				</div>
			</div>
		)
	}
};