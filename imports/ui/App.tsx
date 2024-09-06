import React from 'react';
// import { Cog } from './components/Cog';
import { CardsContainer } from './components/CardsContainer';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';
type Card = {
	_id: string;
	wordIds: Array<string>;
}

export const App = () => {
	const allCards = CardsCollection.find({}).fetch() as Card[];
	// console.log("allCards in App", allCards)
	const selectedIndices = shuffleArray(Array.from(Array(allCards.length).keys())).slice(0, 5);
	const selectedCards = selectedIndices.map((index) => allCards[index]);
	// console.log("selectedCards in App", selectedCards)

	return (
		<div className='app'>
			<div className='game-container'>
				{/* <Cog /> */}
				<CardsContainer {...{selectedCards}} />
			</div>
		</div>
	)
};
