import { Meteor } from 'meteor/meteor';
import type { GameType, CardType, PlayerType } from '../api/types';

export const getPlaceholderCards = () => {
	return [1, 2, 3, 4].map((position) => {
		return { _id: position.toString(), words: ["", "", "", ""], position: position };
	});
};

// return the id of the player whose cards will be rendered
export const getPlayerToRender = (game: GameType, playerId: string) => {
	const player = game.players.find((player: PlayerType) => player._id === Meteor.userId());
	const playerIds = game.players.map((player: PlayerType) => player._id);
	const playerIdsExtended = [...playerIds, ...playerIds];
	const playerIndex = playerIds.indexOf(playerId);
	const playerOrder = playerIdsExtended.slice(playerIndex, playerIndex + playerIds.length);
	return playerOrder[player.round];
}

// return the card data for the player whose cards will be rendered
export const getCardsToRender = (game: GameType, userId: string) => {
	const playerToRenderId = getPlayerToRender(game, userId);
	if (!playerToRenderId) return;

	const playerCards = game.players.find((player: PlayerType) => player._id === playerToRenderId).cards;

	// strip any placeholder cards to avoid duplication
	const filteredPlayerCards = playerCards.filter((card: CardType) => {
		return !["1", "2", "3", "4"].includes(card._id);
	})

	// if showing player their own cards, render as-is
	if (playerCards && playerToRenderId === userId) {
		return [...filteredPlayerCards, ...getPlaceholderCards()];

	// otherwise, strip position and rotation from cards on first render
	} else if (playerCards && playerToRenderId !== userId) {
		const resetPlayerCards = filteredPlayerCards.map((card: CardType) => {
			card.position = 5;
			card.rotation = 0;
			return card
		})

		const resetPlaceholderCards = getPlaceholderCards().map((card: CardType) => {
			card.position = parseInt(card._id);
			return card
		})

		return [...resetPlayerCards, ...resetPlaceholderCards];
	}
}

// return the keys for the player whose cards will be rendered
export const getKeysToRender = (game: GameType, playerId: string) => {
	const playerToRenderId = getPlayerToRender(game, playerId);
	const playerToRender = game.players.find((player: PlayerType) => player._id === playerToRenderId)
	return playerToRender.keys
}

export const getReadyForNextRound = (game: GameType, playerId: string) => {
	const player = game.players.find((player: PlayerType) => player._id === playerId);
	return (player && player.ready) ? true : false
}

export const getAllPlayersInPlayerRoundReady = (game: GameType, playerId: string) => {
	const player = game.players.find((player: PlayerType) => player._id === playerId);
	const playersInPlayerRound = game.players.filter((gamePlayer: PlayerType) => gamePlayer.round === player.round);
	const allPlayersInPlayerRoundReady = playersInPlayerRound.every((player: PlayerType) => player.ready);
	return allPlayersInPlayerRoundReady;
}
