import React, { useState, useEffect } from 'react';
import { CogKeys } from './CogKeys';
import { CardsCollection } from '/imports/api/cards/CardsCollection';
import { shuffleArray } from '/imports/helpers/shuffle';

import { WordCardDraggable } from './WordCardDraggable';
import { WordCardSortable } from './WordCardSortable';
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
	const cogContainers = [1, 2, 3, 4];
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
			// console.log("aPosition", a);
			// console.log("bPosition", b);
			if (aPosition === undefined || bPosition === undefined) {
				throw new Error("Invalid card data");
			}
			return aPosition - bPosition;
		});
	}

	const startGame = () => {
		const allCardData = CardsCollection.find({}).fetch() as Card[];
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

	const handleKeyUpdate = (data: string) => {
		keys[0] = data;
		setKeys(keys);
	}

	const moveCard = (cardData: Card, origin: number, destination: number) => {
		// console.log("movedCardData", cardData);
		// console.log("origin", origin);
		// console.log("destination", destination);
		let updatedCard, updatedPlayCards, updatedCogCards;
		const cardToShift = cardsData.find((card) => card.position === destination);
		updatedCard = <WordCardSortable key={cardData._id} {...cardData} position={destination} />;
		cardData.position = destination;
		console.log("origin", origin)
		console.log("cardToShift", cardToShift);
		if(origin === 5  && cardToShift && cogContainers.includes(parseInt(cardToShift._id))) { // moving from play to empty cog space
			console.log("moving from play to empty cog space");
			updatedPlayCards = playCards.filter((card) => card.key !== updatedCard.key);
			updatedCogCards = [
				...cogCards.filter((card) => card.key !== cardToShift?._id), 
				updatedCard
			];
		} else if(origin === 5 && cardToShift) { // moving from play to non-empty cog space
			const cogPlaceholders = cogCards.filter((card) => ["1", "2", "3", "4"].includes(card?.key as string));
			console.log("moving from play to non-empty cog space");
			// console.log("cogPlaceholders", cogPlaceholders);
			if(cogPlaceholders.length > 0) { // shift to empty space if possible
				console.log("have available cogs");
				const emptyCogSpaces = cogPlaceholders.map((card) => cardsData.find((cardData) => cardData._id === card.key)?.position);
				console.log("emptyCogSpaces", emptyCogSpaces);
				let cardToRemoveFromCog;
				if(emptyCogSpaces.includes(destination + 1)) { // shift to next space if empty
					console.log("shift to next space if empty");
					console.log("cards data", cardsData);
					console.log("cog cards", cogCards);
					console.log("play cards", playCards);
					const cardToRemoveFromCogData = cardsData.find((card) => card.position === destination + 1);
					cardToRemoveFromCog = cogCards.find((card) => card.key === cardToRemoveFromCogData?._id);
					console.log("cardToRemoveFromCog", cardToRemoveFromCog);
					cardToShift.position = destination + 1;
					console.log("card to shift + 1", cardToShift);
				} else { // shift to first empty space for now
					console.log("shift to first empty space");
					const placeholderToShift = cardsData.find((card) => card._id === cogPlaceholders[0]?.key);
					const cardToRemoveFromCogData = cardsData.find((card) => card._id === cogPlaceholders[0].key);
					cardToRemoveFromCog = cogCards.find((card) => card.key === cardToRemoveFromCogData?._id);
					cardToShift.position = placeholderToShift ? placeholderToShift.position : cardToShift.position;
				}
				// console.log("update play cards", playCards.filter((card) => card.key !== updatedCard.key));
				// console.log("update cog cards", cogCards.filter((card) => card.key !== cardToRemoveFromCog?._id))
				// console.log("updated card", updatedCard);
				console.log("card to remove from cog", cardToRemoveFromCog);
				updatedPlayCards = [...playCards.filter((card) => card.key !== updatedCard.key)];
				updatedCogCards = [...cogCards.filter((card) => card.key !== cardToRemoveFromCog?.key), updatedCard];
				console.log("updated play cards declaration", updatedPlayCards);
				console.log("updated cog cards declaration", updatedCogCards);
			} else { // shift to play space

			}
			// updatedPlayCards = playCards.filter((card) => card.key !== cardData._id);
			// updatedCogCards = [
			// 	...cogCards.filter((card) => card.key !== cardToShift?._id), 
			// 	updatedCard
			// ];
		} else { // moving from cog to cog
			updatedPlayCards = playCards;
			updatedCogCards = cogCards;
		}
		console.log("updated play cards before state update", updatedPlayCards);
		console.log("updated cog cards before state update", updatedCogCards);
		setPlayCards(sortByPosition(updatedPlayCards));
		setCogCards(sortByPosition(updatedCogCards));
		// setCardsData(cardsData.slice());

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
		console.log("event", event);
		const movedCardData = cardsData.find((card) => card._id === event.active.id) as Card;
		const origin = movedCardData.position;
		const destination = cardsData.find((card) => card._id === event.over.id)?.position || 0;
		moveCard(movedCardData, origin, destination);
		// if(origin && destination) {			
		// 	// moveCard(movedCardData, origin, destination);
		// 	// movedCardData.position = destination;
		// 	// resolveCollision(movedCardData, origin, destination);
		// setCardsData(cardsData.slice());
		// }
		// document.getElementById(movedCardData._id)?.classList.remove("z-top");
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
						{ cogCards.map((card) => (
							<Droppable key={card.key ?? ""} id={card.key ?? ""}>
								{ card }
							</Droppable>
						))}
						{/* {cogContainers.map((id) => (
							<Droppable key={id} id={id}>
								{ cogCards.find((card) => card.props.position.toString() === id) 
									? cogCards.find((card) => card.props.position.toString() === id)
									: "Drop Here"
								}
							</Droppable>
						))} */}
					</div>
				</SortableContext>
			</div>
			<div className="word-card-container">
				{ playCards }
			</div>
		</DndContext>
	)
}