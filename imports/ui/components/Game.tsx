import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe } from 'meteor/react-meteor-data';
import { DndContext, rectIntersection, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSwappingStrategy } from '@dnd-kit/sortable';

// Components
import { Droppable } from './Droppable';
import { CogKeys } from './CogKeys';
import { WordCardDraggable } from './WordCardDraggable';
import { WordCardSortable } from './WordCardSortable';
import { Loading } from './Loading';
import { WaitingOverlay } from './WaitingOverlay';

// Helpers
import { getCardsToRender, getKeysToRender } from '/imports/helpers/gameplay';

// Types
import type { CardType, GameType, PlayerType } from '../../api/types';

interface GameProps {
	game: GameType;
	advanceRound: Function;
}

export const Game = ({ game, advanceRound }: GameProps) => {
	// State
	const [cardsData, setCardsData] = useState<CardType[]>([]);
	const [playCards, setPlayCards] = useState<React.JSX.Element[]>([]);
	const [cogCards, setCogCards] = useState<React.JSX.Element[]>([]);
	const [keys, setKeys] = useState<string[]>(["", "", "", ""]);

	// Hooks
	const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 }});
	const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });
	const sensors = useSensors( pointerSensor, keyboardSensor);
	
	
	const cogContainers = [1, 2, 3, 4];
	const cogContainerIds = ["1", "2", "3", "4"];
	const isLoading = useSubscribe("games");

	useEffect(() => {
		console.log("useEffect Game setCardsData and setKeys");

		const cardsToRender = getCardsToRender(game);
		const keysToRender = getKeysToRender(game);

		setCardsData(cardsToRender || []);
		setKeys(keysToRender || []);

	}, [game]);

	useEffect(() => {
		console.log("useEffect Game setPlayCards and setCogCards");

		const playCardsData = cardsData?.filter((card: CardType) => card.position === 5);
		const playCardElements = playCardsData?.map(card => draggableElement(card));
			if (playCardElements) setPlayCards(sortByPosition(playCardElements));

		const cogCardsData = cardsData?.filter((card: CardType) => card.position !== 5);
		const cogCardElements = cogCardsData?.map(card => sortableElement(card));
		if (cogCardElements) setCogCards(sortByPosition(cogCardElements));

		validateCardsState();

	}, [cardsData]);

	const sortByPosition = (array: any) => {
		const sortedArray = array.sort((a: any, b: any) => {
			const aPosition = cardsData.find((card) => card._id === a.key)?.position;
			const bPosition = cardsData.find((card) => card._id === b.key)?.position;

			if (aPosition === undefined || bPosition === undefined) {
				throw new Error("Invalid card data");
			}
			return aPosition - bPosition;
		});

		return sortedArray;
	}

	const sortableElement = (card: CardType) => {
		return <WordCardSortable key={card._id} card={card} removeCard={handleRemoveCard} updateGame={updateCardRotation} />;
	}

	const draggableElement = (card: CardType) => {
		return <WordCardDraggable key={card._id} card={card} addCard={handleAddCard} />;
	}

	const moveCard = (cardData: CardType, origin: number, destination: number) => {
		// console.log(cardData, origin, destination);
		let cards = cardsData;
		const cardToShiftData = cards.find((card) => card.position === destination);
		let placeholderCardData = cards.find((card) => {
			return cogContainerIds.includes(card._id) && card.position === destination;
		});

		if (origin === 5 && placeholderCardData) { 
		// moving from play to empty cog space

			// console.log("moving from play to empty cog space");
			placeholderCardData.position = 5;
			cardData.position = destination;
		
		} else if(origin === 5 && !placeholderCardData) { 
		// moving from play to non-empty cog space

			// console.log("moving from play to non-empty cog space");
			const cogPlaceholders = cogCards.filter((card) => cogContainerIds.includes(card?.key as string));

			if(cogPlaceholders.length > 0) { 
			// shift to empty space if possible

				// console.log("empty space found, shifting card to shift to empty space");
				const cogPlaceholdersData = cogPlaceholders.map((card) => cards.find((cardData) => cardData._id === card.key));
				const emptyCogSpaces = cogPlaceholdersData.map((placeholderData) => placeholderData?.position);

				if(emptyCogSpaces.includes(destination + 1)) { 
				// shift to next space if empty

					// console.log("shifting card to next space")
					placeholderCardData = cards.find((card) => {
						return cogContainerIds.includes(card._id) && card.position === destination + 1;
					});
					if (placeholderCardData) placeholderCardData.position = 5;
					if (cardToShiftData) cardToShiftData.position = destination + 1;
					cardData.position = destination;
					
				} else if (emptyCogSpaces[0] !== undefined) { 
				// shift to first empty space for now

					// console.log("shifting card to first empty space")
					placeholderCardData = cardsData.find((card) => card._id === emptyCogSpaces[0]?.toString());
					if (placeholderCardData) placeholderCardData.position = 5;
					if (cardToShiftData) cardToShiftData.position = emptyCogSpaces[0];
					cardData.position = destination;
				}

			} else { 
			// shift to play space if no empty spaces

				// console.log("shifting card to play space")
				if (cardToShiftData) cardToShiftData.position = 5;
				cardData.position = destination;

			}

		} else if (destination === 5) {
		// moving from cog to play

			// console.log("moving from cog to play")
			placeholderCardData = cardsData.find((card) => card._id === origin.toString());
			if (placeholderCardData) placeholderCardData.position = origin;
			cardData.position = destination;


		} else { 
		// moving from cog to cog

			// console.log("moving from cog to cog")
			if(cardToShiftData) cardToShiftData.position = origin;
			cardData.position = destination;

		}

		const updatedPlayCardData = cardsData.filter((cardData) => cardData.position === 5);;
		const updatedCogCardData = cardsData.filter((cardData) => cogContainers.includes(cardData.position));
		let updatedPlayCards = updatedPlayCardData.map(cardData => draggableElement(cardData));
		const updatedCogCards = updatedCogCardData.map(cardData => sortableElement(cardData));

		// strip out any placeholder cards
		updatedPlayCards = updatedPlayCards.length ? updatedPlayCards.filter((card) => card && !["1","2","3","4"].includes(card.key || "")) : updatedPlayCards

		setPlayCards(sortByPosition(updatedPlayCards.filter((card) => card !== undefined)));
		setCogCards(sortByPosition(updatedCogCards));
		setCardsData(cardsData);
	}

	const validateCardsState = () => {
		const placeholdersData = cardsData.filter((card) => cogContainerIds.includes(card._id));
		const placeholderIds = placeholdersData.map((card) => card._id);
		const wordCardsData = cardsData.filter((card) => !placeholderIds.includes(card._id));
		const updatedCogCardsOnlyData = wordCardsData.filter((card) => {
			return cogContainers.includes(card.position);
		});
		const occupiedCogSpaces = updatedCogCardsOnlyData.map((card) => card.position);
		const emptyCogSpaces = cogContainers.filter((space) => !occupiedCogSpaces.includes(space));
		let updatedCogCardsData: CardType[] = [];
		emptyCogSpaces.forEach((space) => {
			const placeholder = placeholdersData.find((card) => card._id === space.toString());
			if (placeholder) {
				updatedCogCardsData.push(placeholdersData.find((card) => card._id === space.toString()) as CardType);
			}
		});
		updatedCogCardsData.push(...updatedCogCardsOnlyData)
		let updatedPlayCardsData = cardsData.filter((card) => card.position === 5 && !placeholdersData.includes(card));
		updatedPlayCardsData.forEach((card) => {
			card.position = 5;
		})

		if (placeholdersData.length !== 4 
			|| updatedCogCardsData.length !== 4 
			|| updatedCogCardsOnlyData.length + updatedPlayCardsData.length !== 5
			|| cardsData.length !== 9) {
				updatedCogCardsData.length !== 4 && console.log("invalid number of cog cards in state");
				updatedCogCardsOnlyData.length + updatedPlayCardsData.length !== 5 && console.log("invalid number of non-placeholder cards in state");
				cardsData.length !== 9 && console.log("invalid total number of cards in state");
				console.log("invalid cards state");
				console.log("placeholdersData", placeholdersData);
				console.log("updatedCogCardsOnlyData", updatedCogCardsOnlyData);
				console.log("updatedPlayCardsData", updatedPlayCardsData);
				console.log("cardsData", cardsData);
				console.log("updatedCogCardsData", updatedCogCardsData);
				console.log("emptyCogSpaces", emptyCogSpaces);
				console.log("occupiedCogSpaces", occupiedCogSpaces);
			}

		const updatedCogCards = updatedCogCardsData.map(cardData => sortableElement(cardData));
		const updatedPlayCards = updatedPlayCardsData.map(cardData => draggableElement(cardData)); 

		setPlayCards(sortByPosition(updatedPlayCards));
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
		const movedCardData = cardsData.find((card) => card._id === event.active.id) as CardType;
		const origin = movedCardData.position;
		if(event.over?.id) {			
			const destination = cardsData.find((card) => card._id === event.over.id)?.position || 5;
			moveCard(movedCardData, origin, destination);
		}
		document.getElementById(movedCardData._id)?.classList.remove("z-top");
	}

	const resetCards = () => {
		const updatedCards = cardsData.map((card) => {
			if (cogContainerIds.includes(card._id)) {
				card.position = parseInt(card._id);
			} else {
				card.position = 5;
			}
			return card;
		});
		setCardsData(updatedCards);
	}

	const handleRemoveCard = (cardId: string) => {
		const updatedCard = cardsData.find((card) => card._id === cardId) as CardType;
		if (updatedCard) {
			moveCard(updatedCard, updatedCard.position, 5);
		}
	}

	const handleAddCard = (cardId: string) => {
		let destination = 4;
		const cardData = cardsData.find((card) => card._id === cardId) as CardType;
		cardData.rotation = 0;
		const cogCardData = cardsData.filter((card) => cogContainers.includes(card.position));
		const cogPlaceholders = cogCardData.filter((card) => cogContainerIds.includes(card._id));
		if (cogPlaceholders.length) {
			destination = cardsData.find((card) => card._id === cogPlaceholders[0]._id)?.position || 4;
		}
		moveCard(cardData, cardData.position, destination);

	}

	const saveGame = async () => {
		if (!validateReadyToSave()) {
			return new Promise((resolve) => resolve(false));
		}

		return await Meteor.callAsync("game.saveCog", game._id, Meteor.userId() as string, cardsData, keys).then(() => {
			return true;
		}).catch((error: Meteor.Error) => {
			console.log("error saving game", error);
			return false
		});
	}

	const validateReadyToSave = () => {
		const allKeysCompleted = () => {
			if (keys.length < 4) return false;
			let result = true;
			keys.forEach((key) => {
				if (!key) result = false;
			});
			return result
		};
		
		const allCardsPlaced = () => {
			// cog position values: 1, 2, 3, 4
			let placedPositions = [1, 2, 3, 4]
			let playedCards: CardType[] = [];

			// filter out placeholder cards
			const playableCards = cardsData.filter((card) => !placedPositions.includes(parseInt(card._id)));

			// push cards to playedCards if they are in a valid cog position
			playableCards.forEach((card) => {
				if (placedPositions.includes(card.position)) {
					playedCards.push(card);
				}
			})

			// ensure there are no duplicated positions
			const playedPositions = playedCards.map((card) => card.position);
			let duplicatedPositions = playedPositions.filter((card, index) => playedPositions.indexOf(card) !== index)
			
			return (playedCards.length === 4 && duplicatedPositions.length === 0) ? true : false
		}
		
		return allKeysCompleted() && allCardsPlaced();
	}

	const updateCardRotation = (cardId: string, rotation: number) => {
		const cardData = cardsData.find((card) => card._id === cardId) as CardType;
		if (cardData) {
			cardData.rotation = rotation % 1;
		}
		setCardsData([...cardsData]);
	}

	const readyForNextRound = () => {
		const player = game.players.find((player: PlayerType) => player._id === Meteor.userId());
		return (player && player.ready) ? true : false
	}

	const allPlayersReady = () => {
		const playerRound = game.players.find((player: PlayerType) => player._id === Meteor.userId()).round;
		const playersInRound = game.players.filter((player: PlayerType) => player.round === playerRound);
		return playersInRound.every((player: PlayerType) => player.ready);
	}

	return (
		<>
			{isLoading() ? <Loading /> :
				<>
					<DndContext 
						sensors={sensors} 
						collisionDetection={rectIntersection} 
						onDragStart={handleDragStart} 
						onDragEnd={handleDragEnd}
					>
						<div className="cog-container">
							<CogKeys 
								updateKeys={handleKeyUpdate} 
								resetCards={resetCards} 
								saveGame={saveGame} 
								keys={keys} 
								playerReady={readyForNextRound} 
								round={game.round}
							/>
							<SortableContext 
								items={cogCards.map((card) => card.key || "")} 
								strategy={rectSwappingStrategy}
							>
								<div className="droppable-container">
									{ cogCards.map((card) => (
										<Droppable 
											key={card.key ?? ""} 
											id={card.key ?? ""}
										>
											{ card }
										</Droppable>
									))}
								</div>
							</SortableContext>
						</div>
						<div className="draw-container">
							{ playCards }
						</div>
					</DndContext>
					{readyForNextRound() &&
						<WaitingOverlay 
							allPlayersReady={allPlayersReady} 
							advanceRound={advanceRound}
						/>
					}
				</>
			}
		</>
	)
}
