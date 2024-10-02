import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export const Header = ({ user }: { user: Meteor.User }) => {
	return (
		<header>
			<div className="navbar">
				<div className="header-icons-container home-icon-container">
					<Link to="/">
						<img className='header-img' src='/home-icon.png' />
					</Link>
				</div>
				<div className="app-title">
					<div>Keys</div>
					<div>
						<img className='title-cog-img' src='/header-cog-icon.png' />
					</div>
					<div>Cogs</div>
				</div>
				<div className="header-icons-container">
					{!user && 
						// <div>
							<Link to="/login">
								<img className='header-img' src='/account-icon.png' />
							</Link>
						// </div>	
					}
					{user && 
						<>
							{/* <div> */}
								<Link to="/play">
									<img className='header-img mr-4' src='/play-icon.png' />
								</Link>
							{/* </div> */}
							{/* <div> */}
								<Link to="/account">
									<img className='header-img' src='/account-icon.png' />
								</Link>
							{/* </div> */}
						</>
					}
				</div>
			</div>
		</header>
	);
}