import React, { useState, useEffect } from 'react';
import { CogKeys } from './CogKeys';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';

import { DndContext } from '@dnd-kit/core';
import { WordCard } from './WordCard';
import { Droppable } from './Droppable';

export type Card = {
	_id: string;
	words: Array<string>;
	position: number;
}

export const Game = () => {

	const [isPlaying, setIsPlaying] = useState(false);
	const [cardsData, setCardsData] = useState<Card[]>([]);
	const [playCards, setPlayCards] = useState<React.JSX.Element[]>([]);
	const [cogCards, setCogCards] = useState<React.JSX.Element[]>([]);
	const [keys, setKeys] = useState<string[]>(["", "", "", ""]);
	const containers = ["1", "2", "3", "4"];

	useEffect(() => {
		const loadData = () => {
			// console.log("loading data");
			const playCardsData = cardsData.filter((card) => card.position === 5);
			const cogCardsData = cardsData.filter((card) => card.position !== 5);

			const playCardElements = playCardsData.map((card) => {
				return <WordCard key={card._id} {...card} />;
			});
			setPlayCards(playCardElements);

			const cogCardElements = cogCardsData.map((card) => {
				return <WordCard key={card._id} {...card} />;
			});
			setCogCards(cogCardElements);

		};
		loadData();
	}, [cardsData]);

	const startGame = () => {
		const allCardData = CardsCollection.find({}).fetch() as Card[];
		const randomIndexes = shuffleArray(Array.from(Array(allCardData.length).keys())).slice(0, 5);
		const startingCardData = randomIndexes.map((index) => {
			let card = allCardData[index];
			card.position = 5;
			return card;
		});
		setCardsData(startingCardData);
		setIsPlaying(true);
	}

	const handleKeyUpdate = (data: string) => {
		keys[0] = data;
		setKeys(keys);
	}

	const moveCard = (cardData: Card, origin: number, destination: number) => {
		let updatedCard,updatedPlayCards, updatedCogCards;
		updatedCard = <WordCard key={cardData.key} {...cardData} position={destination} />;
		if(origin === 5) { // moving from play to cog
			updatedPlayCards = playCards.filter((card) => card.key !== cardData._id);
			updatedCogCards = [...cogCards, <WordCard key={cardData.key} {...cardData} position={destination} />];
		} else { // moving from cog to cog
			updatedPlayCards = playCards;
			updatedCogCards = cogCards;
		}
		setPlayCards(updatedPlayCards);
		setCogCards(updatedCogCards)
	}
	
	const handleDragEnd = (event: any) => {
		const movedCardData = cardsData.find((card) => card._id === event.active.id) as Card;
		const origin = movedCardData.position;
		const destination = parseInt(event.over.id);
		moveCard(movedCardData, origin, destination);
		movedCardData.position = destination;
		setCardsData(cardsData.slice());
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className="startGameContainer">
				<button className='startGameButton' onClick={startGame}>Start Game</button>
			</div>
			<div className="cog-container">
				<CogKeys updateKeys={handleKeyUpdate} keys={keys}/>
				<div className="droppable-container">
					{containers.map((id) => (
						<Droppable key={id} id={id}>
							<div className="word-card-wrapper">
								{cogCards.map((card) => card.props.position.toString()).includes(id) 
									? cogCards.find((card) => card.props.position.toString() === id)
									: 'Drop here'
								}
							</div>
						</Droppable>
					))}
				</div>
			</div>
			<div className="word-card-container">
				{ playCards }
			</div>
		</DndContext>
	)
}