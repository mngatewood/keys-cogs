import React, { useState, useEffect } from 'react';
import { CogKeys } from './CogKeys';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';

import { WordCardDraggable } from './WordCardDraggable';
import { Droppable } from './Droppable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, Activation } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

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
	const cogContainers = ["1", "2", "3", "4"];
	const pointerSensor = useSensor(PointerSensor, {
		activationConstraint: {
			distance: 20,
		},
	});
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});
	const sensors = useSensors( pointerSensor, keyboardSensor);


	useEffect(() => {
		const loadData = () => {
			const playCardsData = cardsData.filter((card) => card.position === 5);
			const cogCardsData = cardsData.filter((card) => card.position !== 5);

			const playCardElements = playCardsData.map((card) => {
				return <WordCardDraggable key={card._id} {...card} />;
			});
			setPlayCards(playCardElements);

			const cogCardElements = cogCardsData.map((card) => {
				return <WordCardDraggable key={card._id} {...card} />;
			});
			setCogCards(cogCardElements);
		};
		loadData();
	}, [cardsData]);

	const startGame = () => {
		const allCardData = CardsCollection.find({}).fetch() as Card[];
		const randomIndexes = shuffleArray(Array.from(Array(allCardData.length).keys())).slice(0, 5);
		const startingCardData = randomIndexes.map((value) => {
			let card = allCardData[value];
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
		updatedCard = <WordCardDraggable key={cardData.key} {...cardData} position={destination} />;
		if(origin === 5) { // moving from play to cog
			updatedPlayCards = playCards.filter((card) => card.key !== cardData._id);
			updatedCogCards = [...cogCards, <WordCardDraggable key={cardData.key} {...cardData} position={destination} />];
		} else { // moving from cog to cog
			updatedPlayCards = playCards;
			updatedCogCards = cogCards;
		}
		setPlayCards(updatedPlayCards);
		setCogCards(updatedCogCards)
	}

	const resolveCollision = (movedCardData: Card, origin: number, destination: number) => {
		const collidingCard = cardsData.find((card) => card._id !== movedCardData._id && card.position === destination);
		if(collidingCard) {			
			collidingCard.position = origin;
			setCardsData(cardsData.slice());
		}
	}

	const handleDragStart = (event: any) => {
		const { id } = event.active;
		document.getElementById(id)?.classList.add("z-top");
	}
	
	const handleDragEnd = (event: any) => {
		// const { active, over } = event;
		const movedCardData = cardsData.find((card) => card._id === event.active.id) as Card;
		const origin = movedCardData.position;
		const destination = parseInt(event.over.id);
		moveCard(movedCardData, origin, destination);
		movedCardData.position = destination;
		resolveCollision(movedCardData, origin, destination);
		setCardsData(cardsData.slice());
		document.getElementById(movedCardData._id)?.classList.remove("z-top");
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="startGameContainer">
				<button className='startGameButton' onClick={startGame}>Start Game</button>
			</div>
			<div className="cog-container">
				<CogKeys updateKeys={handleKeyUpdate} keys={keys}/>
				<SortableContext items={cogCards.map((card) => card.key || "")} >
					<div className="droppable-container">
						{cogContainers.map((id) => (
							<Droppable key={id} id={id}>
								{ cogCards.find((card) => card.props.position.toString() === id) 
									? cogCards.find((card) => card.props.position.toString() === id)
									: "Drop Here"
								}
							</Droppable>
						))}
					</div>
				</SortableContext>
			</div>
			<div className="word-card-container">
				{ playCards }
			</div>
		</DndContext>
	)
}