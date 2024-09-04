import React from 'react';

export const KeyCard = () => {

	let turn = 0;

	const rotateKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
		direction === "clockwise" ? turn = turn + 0.25 : turn = turn - 0.25;
		const keyCardOuter = (e.target as HTMLElement).closest(".key-center-buttons")?.previousElementSibling;
		(keyCardOuter as HTMLElement).style.transform = "rotate(" + turn + "turn)";
	}

	return (
		<div className='key-card'>
			<div className='key-card-outer'>
				<div className='key key-top'>butterfly</div>
				<div className='key key-left'>dinosaur</div>
				<div className='key key-center'></div>
				<div className='key key-right'>family</div>
				<div className='key key-bottom'>soldier</div>
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
