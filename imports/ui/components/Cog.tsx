import React from 'react';
import { KeyCard } from './KeyCard';
import { TransitionGroup, CSSTransition } from "react-transition-group";

export const Cog = () => {

	const [turn, setTurn] = React.useState(0);
	const [key1, setKey1] = React.useState("");
	const [key2, setKey2] = React.useState("");
	const [key3, setKey3] = React.useState("");
	const [key4, setKey4] = React.useState("");

	const rotateCog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const keyCardOuter = (e.target as HTMLElement).closest(".cog-container")?.querySelector(".cog-cards-container");
		setTurn(turn + 0.25);
		setKey1(key4);
		setKey2(key1);
		setKey3(key2);
		setKey4(key3);
		(keyCardOuter as HTMLElement).style.transform = "rotate(" + turn + "turn)";
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
							<input type="text" className='cog-input' placeholder='*hint*' value={key1} onChange={(e) => setKey1(e.target.value)} />
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
					<KeyCard />
					<KeyCard />
					<KeyCard />
					<KeyCard />
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
