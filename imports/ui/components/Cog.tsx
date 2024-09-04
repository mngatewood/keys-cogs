import React from 'react';
import { KeyCard } from './KeyCard';


export const Cog = () => {
	return (
		<div className='cog-container'>
			<div className='cog-top'>
				<input type="text" className='cog-input' placeholder='Secret key' />
			</div>
			<div className='cog-left'>
				<input type="text" className='cog-input' placeholder='Secret key' />
			</div>
			<div className='cog-cards-container'>
				<KeyCard />
				<KeyCard />
				<KeyCard />
				<KeyCard />
			</div>
			<div className='cog-right'>
				<input type="text" className='cog-input' placeholder='Secret key' />
			</div>
			<div className='cog-bottom'>
				<input type="text" className='cog-input' placeholder='Secret key' />
			</div>
		</div>
	);
};
