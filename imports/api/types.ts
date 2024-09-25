export type PlayerType = {
	_id: string
	keys: string[]
	cards: any[]
	results: any[]
}

export type CardType = {
	_id: string;
	words: Array<string>,
	position: number,
	rotation?: number
}

export type GameType = {
	_id: string,
	hostId: string,
	round: number,
	players: Array<any>,
	cards: Array<string>,
	completed: boolean,
	started: boolean,
};




