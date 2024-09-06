import React from 'react';
import { KeyCard } from './KeyCard';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect, useState } from 'react';
import type { Card } from '../App';

export const Cog = ( { playedCards }: { playedCards: Card[] }) => {
	const [cards, setCards] = useState<React.JSX.Element[]>([]);
	const [keys, setKeys] = useState(["", "", "", ""]);
	const [rotation, setRotation] = useState(0);
	useEffect(() => {
		const loadData = () => {
			const keyCards = playedCards.map((card) => {
				return <KeyCard key={card._id} {...card} />;
			});
			setCards(keyCards);
		};
		loadData();
	}, [playedCards]);

	// top key
	const key1 = keys[0];
	// right key
	const key2 = keys[1];
	// bottom key
	const key3 = keys[2];
	// left key
	const key4 = keys[3];

	const setKey1 = (key: string) => {
		keys[0] = key;
		setKeys(keys);
	}
	
	const rotateCog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const keyCardOuter = (e.target as HTMLElement).closest(".cog-container")?.querySelector(".cog-cards-container");

		setRotation(rotation + 0.25 );
		keys.push(keys.shift() ?? '');
		setKeys(keys);
		(keyCardOuter as HTMLElement).style.transform = "rotate(" + rotation + "turn)";
	}
	return (
		<div className='cog-container'>
			<div className="cog">
				<div className='clue cog-top'>
					<TransitionGroup className="card-container">
						<CSSTransition
							key={key3}
							timeout={1000}
							classNames="slideX"
						>
							<input 
								type="text" 
								className='cog-input' 
								placeholder='*hint*' 
								value={key1} 
								onChange={(e) => setKey1(e.target.value)} 
							/>
						</CSSTransition>
					</TransitionGroup>
				</div>
				<div className='clue cog-left'>
					<TransitionGroup className="card-container">
						<CSSTransition
							key={key4}
							timeout={1000}
							classNames="slideY"
						>
							<div className="animate-key">{key4}</div>
						</CSSTransition>
					</TransitionGroup>
				</div>
				<div className='cog-cards-container'>
					{cards}
				</div>
				<div className='clue cog-right'>
					<TransitionGroup className="card-container">
						<CSSTransition
							key={key2}
							timeout={1000}
							classNames="slideY"
						>
							<div className="animate-key">{key2}</div>
						</CSSTransition>
					</TransitionGroup>
				</div>
				<div className='clue cog-bottom'>
					<TransitionGroup className="card-container">
						<CSSTransition
							key={key3}
							timeout={1000}
							classNames="slideX"
						>
							<div className="animate-key">{key3}</div>
						</CSSTransition>
					</TransitionGroup>
				</div>
			</div>
			<div className='center-buttons cog-center-buttons'>
				<button onClick={rotateCog} className='cog-button'>
					<img className='cog-img' src='/clockwise-arrow.png' />
				</button>
			</div>
		</div>
	);
};
