import React from 'react'
import { Meteor } from 'meteor/meteor';
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = () => {
	let auth = Meteor.user();
	return (
		auth ? <Outlet /> : <Navigate to='/login' />
	)
}