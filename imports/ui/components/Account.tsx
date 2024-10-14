import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'
import { logoutDemoUser } from '/imports/helpers/utils';

export const Account = () => {
	const user = useTracker(() => Meteor.user());
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			logoutDemoUser();
		}
	}, [])

	const handleLogout = () => {
		Meteor.logout();
	}

	return (
		<div className="account-container flex items-center justify-center w-full h-full fade-in">
			<div className="account-games-container bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Account</h1>
				<h2 className="text-xl font-bold text-center mb-4">Email: {user?.emails?.[0].address}</h2>
				<button onClick={handleLogout} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1  hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">
					Logout
				</button>
			</div>
		</div>
	);
}