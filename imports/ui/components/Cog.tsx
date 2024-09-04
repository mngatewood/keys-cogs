import React from 'react';
import { KeyCard } from './KeyCard';


export const Cog = () => {
	let turn = 0;
	// let key1 = ""
	// let key2 = ""
	// let key3 = ""
	// let key4 = ""

	const rotateCog = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const keyCardOuter = (e.target as HTMLElement).closest(".cog-container")?.querySelector(".cog-cards-container");
		console.log(keyCardOuter)
		turn = turn + 0.25;
		(keyCardOuter as HTMLElement).style.transform = "rotate(" + turn + "turn)";
	}

	return (
		<div className='cog-container'>
			<div className="cog">
				<div className='clue cog-top'>
					<input type="text" className='cog-input' placeholder='Secret key'/>
				</div>
				<div className='clue cog-left'>
					{/* {key4} */}
				</div>
				<div className='cog-cards-container'>
					<KeyCard />
					<KeyCard />
					<KeyCard />
					<KeyCard />
				</div>
				<div className='clue cog-right'>
					{/* {key2} */}
				</div>
				<div className='clue cog-bottom'>
					{/* {key3} */}
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
