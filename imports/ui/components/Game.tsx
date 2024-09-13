import React, { useState, useEffect } from 'react';
import { CogKeys } from './CogKeys';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';

import { WordCardDraggable } from './WordCardDraggable';
import { WordCardSortable } from './WordCardSortable';
import { Droppable } from './Droppable';
import { DndContext, rectIntersection, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSwappingStrategy } from '@dnd-kit/sortable';
import { demoCards, demoKeys } from '/imports/api/demoData';

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
	const cogContainers = [1, 2, 3, 4];
	const pointerSensor = useSensor(PointerSensor, {
		activationConstraint: { distance: 5 }
	});
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
	});
	const sensors = useSensors( pointerSensor, keyboardSensor);

	useEffect(() => {
		const loadData = () => {
			const playCardsData = cardsData.filter((card) => card.position === 5);
			const cogCardsData = cardsData.filter((card) => card.position !== 5);
			console.log(playCardsData, cogCardsData);

			const playCardElements = playCardsData.map((card) => {
				return <WordCardDraggable key={card._id} {...card} />;
			});
			setPlayCards(sortByPosition(playCardElements));

			const cogCardElements = cogCardsData.map((card) => {
				return <WordCardSortable key={card._id} {...card} />;
			});
			setCogCards(sortByPosition(cogCardElements));
		};
		loadData();
	}, [cardsData]);

	const sortByPosition = (array: React.JSX.Element[]) => {
		return array.sort((a: any, b: any) => {
			const aPosition = cardsData.find((card) => card._id === a.key)?.position;
			const bPosition = cardsData.find((card) => card._id === b.key)?.position;
			if (aPosition === undefined || bPosition === undefined) {
				throw new Error("Invalid card data");
			}
			return aPosition - bPosition;
		});
	}

	const startGame = () => {
		const allCardData = CardsCollection.find({}).fetch() as Card[];
		dealCards(allCardData);
	}

	const startDemo = () => {
		const allCardData = demoCards as Card[];
		setKeys(demoKeys);
		dealCards(allCardData)
	}

	const dealCards = (allCardData?: Card[]) => {
		if(allCardData) {
			const randomIndexes = shuffleArray(Array.from(Array(allCardData.length).keys())).slice(0, 5);
			const startingCardData = randomIndexes.map((value) => {
				let card = allCardData[value];
				card.position = 5;
				return card;
			});
			const placeholderCards = cogContainers.map((container) => {
				return { _id: container.toString(), words: ["", "", "", ""], position: container }
			})
			setCardsData([...startingCardData, ...placeholderCards]);
			setIsPlaying(true);
		}
	}

	const moveCard = (cardData: Card, origin: number, destination: number) => {
		let updatedCard, updatedPlayCards, updatedCogCards;
		const cardToShiftData = cardsData.find((card) => card.position === destination);
		updatedCard = <WordCardSortable key={cardData._id} {...cardData} position={destination} />;
		cardData.position = destination;

		if(origin === 5  && cardToShiftData && cogContainers.includes(parseInt(cardToShiftData._id))) { 
		// moving from play to empty cog space

			updatedPlayCards = playCards.filter((card) => card.key !== updatedCard.key);
			updatedCogCards = [...cogCards.filter((card) => card.key !== cardToShiftData?._id), updatedCard];

		} else if(origin === 5 && cardToShiftData) { 
		// moving from play to non-empty cog space

			const cogPlaceholders = cogCards.filter((card) => ["1", "2", "3", "4"].includes(card?.key as string));

			if(cogPlaceholders.length > 0) { 
			// shift to empty space if possible

				const emptyCogSpaces = cogPlaceholders.map((card) => cardsData.find((cardData) => cardData._id === card.key)?.position);
				let cardToRemoveFromCog;

				if(emptyCogSpaces.includes(destination + 1)) { 
				// shift to next space if empty

					const cardToRemoveFromCogData = cardsData.find((card) => card.position === destination + 1);
					cardToRemoveFromCog = cogCards.find((card) => card.key === cardToRemoveFromCogData?._id);
					cardToShiftData.position = destination + 1;

				} else { 
				// shift to first empty space for now

					const placeholderToShift = cardsData.find((card) => card._id === cogPlaceholders[0]?.key);
					const cardToRemoveFromCogData = cardsData.find((card) => card._id === cogPlaceholders[0].key);
					cardToRemoveFromCog = cogCards.find((card) => card.key === cardToRemoveFromCogData?._id);
					cardToShiftData.position = placeholderToShift ? placeholderToShift.position : cardToShiftData.position;
				}
				updatedPlayCards = [...playCards.filter((card) => card.key !== updatedCard.key)];
				updatedCogCards = [...cogCards.filter((card) => card.key !== cardToRemoveFromCog?.key), updatedCard];

			} else { 
			// shift to play space if no empty spaces

				cardToShiftData.position = 5;
				const cardToShift = <WordCardDraggable key={cardToShiftData._id} {...cardToShiftData} />;
				updatedPlayCards = [...playCards.filter((card) => card.key !== updatedCard?.key), cardToShift];
				updatedCogCards = [...cogCards.filter((card) => card.key !== cardToShiftData?._id), updatedCard]; 
			}

		} else { 
		// moving from cog to cog

			if(cardToShiftData) {
				cardToShiftData.position = origin;
			}

			updatedPlayCards = playCards;
			updatedCogCards = cogCards;
		}

		// strip out any placeholder cards
		updatedPlayCards = updatedPlayCards.length ? updatedPlayCards.filter((card) => card && !["1","2","3","4"].includes(card.key || "")) : updatedPlayCards

		setPlayCards(sortByPosition(updatedPlayCards.filter((card) => card !== undefined)));
		setCogCards(sortByPosition(updatedCogCards));
	}

	const handleKeyUpdate = (data: string[]) => {
		setKeys(data);
	}

	const handleDragStart = (event: any) => {
		const { id } = event.active;
		document.getElementById(id)?.classList.add("z-top");
	}
	
	const handleDragEnd = (event: any) => {
		const movedCardData = cardsData.find((card) => card._id === event.active.id) as Card;
		const origin = movedCardData.position;
		if(event.over?.id) {			
			const destination = cardsData.find((card) => card._id === event.over.id)?.position || 0;
			moveCard(movedCardData, origin, destination);
		}
		document.getElementById(movedCardData._id)?.classList.remove("z-top");
	}

	return (
		<DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			{ !isPlaying &&	
				<div className="start-game-container">
					<button className='start-game-button' onClick={startGame}>Start Game</button>
					<button className='start-game-button' onClick={startDemo}>Start Demo</button>
				</div>
			}
			{ isPlaying &&
				<div className="cog-container">
					<CogKeys updateKeys={handleKeyUpdate} keys={keys}/>
					<SortableContext items={cogCards.map((card) => card.key || "")} strategy={rectSwappingStrategy} >
						<div className="droppable-container">
							{ cogCards.map((card) => (
								<Droppable key={card.key ?? ""} id={card.key ?? ""}>
									{ card }
								</Droppable>
							))}
						</div>
					</SortableContext>
				</div>
				}
			{ isPlaying &&
				<div className="draw-container">
					{ playCards }
				</div>
			}
		</DndContext>
	)
}