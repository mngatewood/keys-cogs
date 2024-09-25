import React from 'react'
import { Meteor } from 'meteor/meteor';
import { Navigate, Outlet } from 'react-router-dom'


export const PrivateRoutes = () => {
	const loggedIn = Meteor.userId() !== null;
	return (
		loggedIn ? <Outlet /> : <Navigate to='/login' />
	)
}