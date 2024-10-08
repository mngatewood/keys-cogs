export type PlayerType = {
	_id: string,
	ready: boolean,
	round: number,
	keys: string[],
	cards: any[],
	results: any[],
}

export type CardType = {
	_id: string,
	words: Array<string>,
	position: number,
	rotation?: number,
}

export type GameType = {
	_id: string,
	hostId: string,
	round: number,
	isDemo: boolean,
	players: Array<any>,
	cards: Array<CardType>,
	completed: boolean,
	started: boolean,
};

export type RoundResultsType = {
	message: string,
	finalRound?: boolean,
	roundComplete?: boolean,
	incorrectPositions?: string[],
	correctPositions?: string[],
	score?: number,
	attempts?: number
	solution?: Array<CardType>,
	keys?: Array<string>
}
