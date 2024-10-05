import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'
import { logoutDemoUser } from '/imports/helpers/utils';

export const Account = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!Meteor.user()) {
			navigate("/login");
		} else {
			logoutDemoUser();
		}
	}, [])

	const handleLogout = () => {
		Meteor.logout();
	}

	return (
		<div className="account-container flex items-center justify-center w-full h-full">
			<div className="account-games-container bg-white shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto max-w-md w-5/6 mx-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">Account</h1>
				<button onClick={handleLogout} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1  hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">
					Logout
				</button>
			</div>
		</div>
	);
}