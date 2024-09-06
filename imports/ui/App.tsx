import React from 'react';
import { Cog } from './components/Cog';
import { CardsContainer } from './components/CardsContainer';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';
import { useEffect, useState } from 'react';

export type Card = {
	_id: string;
	wordIds: Array<string>;
}

export const App = () => {
	const [dealtCards, setDealtCards] = useState<Card[]>([]);
	const [playedCards, setPlayedCards] = useState<Card[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const allCards = CardsCollection.find({}).fetch() as Card[];
			const selectedIndices = shuffleArray(Array.from(Array(allCards.length).keys())).slice(0, 5);
			const dealtCards = selectedIndices.map((index) => allCards[index]);
			setDealtCards(dealtCards);

			// get played cards from local storage, then...
			setPlayedCards([]);
		};
		loadData();
	}, []);	

	return (
		<div className='app'>
			<div className='game-container'>
				<Cog {...{ playedCards }} />
				<CardsContainer {...{ dealtCards }} />
			</div>
		</div>
	)
};
