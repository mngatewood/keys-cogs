import React from 'react';
import { Cog } from './components/Cog';
import { CardsContainer } from './components/CardsContainer';

export const App = () => (
	<div className='app'>
		{/* <h1>Welcome to Keys & Cogs!</h1> */}
		<div className='game-container'>
			<Cog />
			<CardsContainer />
		</div>
	</div>
);
