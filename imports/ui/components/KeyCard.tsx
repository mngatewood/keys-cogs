import React from 'react';
import { WordsCollection } from '/imports/api/words/WordsCollection';
import { useEffect, useState } from 'react';
import type { Card } from '../App';

export const KeyCard =  (card: Card) => {
	const [keywords, setKeywords] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			let words = [];
			for (const id of card.wordIds) {
				console.log("card", card);
				const word = await WordsCollection.findOneAsync({ _id: id });
				words.push(word?.text);
			}
			setKeywords(words);
		};
		loadData();
	}, []);

	if (!keywords.length) {
		return <div>Loading...</div>;
	}
	console.log("keywords", keywords)

	let turn = 0;

	const rotateKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
		direction === "clockwise" ? turn = turn + 0.25 : turn = turn - 0.25;
		const keyCardOuter = (e.target as HTMLElement).closest(".key-center-buttons")?.previousElementSibling;
		(keyCardOuter as HTMLElement).style.transform = "rotate(" + turn + "turn)";
	}

	return (
		<div className='key-card'>
			<div className='key-card-outer'>
				<div className='key key-top'>{keywords[0]}</div>
				<div className='key key-left'>{keywords[3]}</div>
				<div className='key key-center'></div>
				<div className='key key-right'>{keywords[1]}</div>
				<div className='key key-bottom'>{keywords[2]}</div>
			</div>
			<div className='center-buttons key-center-buttons'>
				<button onClick={(event) => rotateKey(event, "clockwise")} className='key-button rotate-button'>
					<img className='key-img' src='/clockwise-arrow.png' />
				</button>
				<button onClick={(event) => rotateKey(event, "counter clockwise")} className='key-button rotate-button'>
					<img className='key-img' src='/counter-clockwise-arrow.png' />
				</button>
			</div>
		</div>
	);
};
