import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../helpers/registerValidation';

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [emailError, setEmailError] = useState("*Required");
	const [passwordError, setPasswordError] = useState("*Required");
	const navigate = useNavigate();

	if(Meteor.user()) {
		navigate("/");
	}

	const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const isValid = validateEmail(e.target.value)
		if (e.target.value === "") {
			setEmailError("*Required");
		}
		else if (isValid) {
			setEmailError("");
			setEmail(e.target.value);
		} else {
			setEmailError("Email address is invalid.");
		}
		setLoginError("");
	};

	const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.value === "") {
			setPasswordError("*Required");
		} else {
			setPassword(e.target.value);
			setPasswordError("");
		}
		setLoginError("");
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();

		Meteor.loginWithPassword(email, password, (error) => {
			if (error) {
				setLoginError((error as Meteor.Error).reason ?? "Unknown error");
			} else {
				console.log("login success");
				navigate("/");
			}
		});
	};

	return (
		<>
			{!Meteor.user() &&
				<div className="min-h-screen flex items-center justify-center w-full">
					<div className="bg-white shadow-md border border-gray-300 rounded-lg px-8 py-6 w-5/6 max-w-md">
						<h1 className="text-2xl font-bold text-center mb-4">Login</h1>
						<form action="#">
							<div className="mb-4">
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
								<input onChange={handleChangeEmail} type="email" id="email" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required />
								<p className="error pl-2 text-sm text-red-500">{emailError}</p>
							</div>
							<div className="mb-4">
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
								<input onChange={handleChangePassword} type="password" id="password" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" required />
								<p className="error pl-2 text-sm text-red-500">{passwordError}</p>
							</div>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center">
									<a href="#" className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										Forgot Password?
									</a>
								</div>
								<a href="/register" className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
									Create Account
								</a>
							</div>
							<button onClick={handleSubmit} type="submit" disabled={!!(passwordError || emailError || loginError)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								Login
							</button>
							<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
								{loginError}
							</div>
						</form>
					</div>
				</div>
			}
		</>
	);
};