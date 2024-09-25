export type Player = {
	_id: string
	keys: string[]
	cards: any[]
	results: any[]
}

export type Card = {
	_id: string;
	words: Array<string>,
	position: number,
}

export type Game = {
	_id: string,
	hostId: string,
	round: number,
	players: Array<any>,
	cards: Array<string>,
	completed: boolean,
	started: boolean,
};




