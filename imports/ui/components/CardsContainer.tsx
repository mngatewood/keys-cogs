import React from 'react';
import { KeyCard } from './KeyCard';
import { useEffect, useState } from 'react';
import type { Card } from '../App';

export const CardsContainer = ( { dealtCards }: { dealtCards: Card[] }) => {
	const [cards, setCards] = useState<React.JSX.Element[]>([]);
	useEffect(() => {
		const loadData = () => {
			console.log("cards in CardsContainer", cards)
			const keyCards = dealtCards.map((card) => {
				return <KeyCard key={card._id} {...card} />;
			});
			console.log("keyCards in CardsContainer", keyCards)
			setCards(keyCards);
		};
		loadData();
	}, [dealtCards]);

	return (
		<div className='cards-container'>
			{cards}
		</div>
	);
	}