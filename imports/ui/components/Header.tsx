import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useLocation } from 'react-router-dom';

export const Header = ({ user }: { user: Meteor.User }) => {
	const location = useLocation();

	return (
		<header>
			<div className="navbar">
				<div className="header-icons-container home-icon-container">
					<Link to="/">
						<img className='header-img' src='/home-icon.png' title="Go to Home page"/>
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
						<Link to="/login">
							<img className='header-img' src='/account-icon.png' title="Log in" />
						</Link>
					}
					{user &&
						<>
							{!location.pathname.includes("/play") &&
								<Link to="/play">
									<img className='header-img ml-4' src='/play-icon.png' title="Start or join a game"/>
								</Link>
							}
							{!location.pathname.includes("/account") &&
								<Link to="/account">
									<img className='header-img ml-4' src='/account-icon.png' title="Go to account page" />
								</Link>
							}
						</>
					}
				</div>
			</div>
		</header>
	);
}