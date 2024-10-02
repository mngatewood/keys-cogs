import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export const Header = ({ user }: { user: Meteor.User }) => {
	return (
		<header className="navbar">
			<div>
				<Link to="/">
					<img className='header-img' src='/home-icon.png' />
				</Link>
			</div>
			<div className="app-title">
				<div>Keys</div>
				<div>
					<img className='header-img title-cog-img' src='/header-cog-icon.png' />
				</div>
				<div>Cogs</div>
			</div>
			<div>
				{!user && 
					<div>
						<Link to="/login">
							<img className='header-img' src='/account-icon.png' />
						</Link>
					</div>}
				{user && 
					<div>
						<Link to="/account">
							<img className='header-img' src='/account-icon.png' />
						</Link>
					</div>
				}
			</div>
		</header>
	);
}