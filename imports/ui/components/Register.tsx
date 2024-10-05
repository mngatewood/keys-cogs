import { Meteor } from "meteor/meteor";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { validateName, validateEmail, validatePassword } from '../../helpers/registerValidation';
import { logoutDemoUser } from "/imports/helpers/utils";

export const Register = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [registerError, setRegisterError] = useState("");
	const [firstNameError, setFirstNameError] = useState("");
	const [lastNameError, setLastNameError] = useState("");
	const [emailError, setEmailError] = useState("*Required");
	const [passwordError, setPasswordError] = useState("*Required");
	const [confirmPasswordError, setConfirmPasswordError] = useState("*Required");
	const navigate = useNavigate();

	useEffect(() => {
		if (Meteor.user()) {
			logoutDemoUser();
			navigate("/");
		}
	}, [Meteor.user()]);

	const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const isValid = validateName(e.target.value);
		if (isValid) {
			setFirstNameError("");
			setFirstName(e.target.value);
		} else if (e.target.value === "") {
			setFirstNameError("");
		} else {
			setFirstNameError("Only letters and hyphens are allowed.");
		}
		setRegisterError("");
	};

	const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const isValid = validateName(e.target.value);
		if (isValid) {
			setLastNameError("");
			setLastName(e.target.value);
		} else if (e.target.value === "") {
			setLastNameError("");
		} else {
			setLastNameError("Only letters and hyphens are allowed.");
		}
		setRegisterError("");
	};

	const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const isValid = validateEmail(e.target.value);
		if (e.target.value === "") {
			setEmailError("*Required");
		} else if (isValid) {
			setEmailError("");
			setEmail(e.target.value);
		} else {
			setEmailError("Email address is invalid.");
		}
		setRegisterError("");
	};

	const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const isValid = validatePassword(e.target.value).valid;
		const error = validatePassword(e.target.value).error
		if (e.target.value === "") {
			setPasswordError("*Required");
		} else if (isValid) {
			setPasswordError("");
			setPassword(e.target.value)
		} else if (error) {
			setPasswordError(error)
		}
		setRegisterError("");
	};

	const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const error = validatePassword(e.target.value).error;
		if (e.target.value === "") {
			setConfirmPasswordError("*Required");
		} else if (e.target.value !== password) {
			setConfirmPasswordError("Passwords do not match.");
		} else if (error) {
			setConfirmPasswordError(error);
		} else {
			setConfirmPasswordError("")
		}
		setRegisterError("");
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			Meteor.callAsync("accounts.insert", firstName, lastName, email /* username */, email, password);
			setRegisterError("");
			navigate("/login");
		} catch (error) {
			const typedError = error as Meteor.Error;
			setRegisterError(typedError.reason as string);
		}
	};

	const disableSubmit = () => {
		return (firstNameError !== "" || lastNameError !== "" || emailError !== "" || passwordError !== "" || confirmPasswordError !== "");
	}

	return (
		<>
			{!Meteor.user() &&
				<div className="h-full overflow-scroll flex items-center justify-center w-full">
					<div className="max-w-md m-auto bg-beige-1 rounded-lg shadow-md border border-gray-300 px-8 py-6 w-5/6 flex flex-col items-center">
						<h1 className="text-xl font-bold text-center text-gray-700 mb-8">Register</h1>
						<form action="#" className="w-full flex flex-col gap-4">
							<div className="flex items-start flex-col justify-start">
								<label htmlFor="firstName" className="text-sm text-gray-700 mr-2">First Name:</label>
								<input onChange={handleChangeFirstName} type="text" id="firstName" name="firstName" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
								<p className="error pl-2 text-sm text-red-500">{firstNameError}</p>
							</div>

							<div className="flex items-start flex-col justify-start">
								<label htmlFor="lastName" className="text-sm text-gray-700 mr-2">Last Name:</label>
								<input onChange={handleChangeLastName} type="text" id="lastName" name="lastName" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
								<p className="error pl-2 text-sm text-red-500">{lastNameError}</p>
							</div>

							<div className="flex items-start flex-col justify-start">
								<label htmlFor="email" className="text-sm text-gray-700 mr-2">Email:</label>
								<input onChange={handleChangeEmail} type="email" id="email" name="email" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
								<p className="error pl-2 text-sm text-red-500">{emailError}</p>
							</div>

							<div className="flex items-start flex-col justify-start">
								<label htmlFor="password" className="text-sm text-gray-700 mr-2">Password:</label>
								<input onChange={handleChangePassword} type="password" id="password" name="password" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
								<p className="error pl-2 text-sm text-red-500">{passwordError}</p>
							</div>

							<div className="flex items-start flex-col justify-start">
								<label htmlFor="confirmPassword" className="text-sm text-gray-700 mr-2">Confirm Password:</label>
								<input onChange={handleChangeConfirmPassword} type="password" id="confirmPassword" name="confirmPassword" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
								<p className="error pl-2 text-sm text-red-500">{confirmPasswordError}</p>
							</div>

							<button onClick={handleSubmit}
								type="submit" disabled={disableSubmit()} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">Register</button>
						</form>
						<div className="mt-4 text-center">
							<span className="text-sm mx-2 text-gray-500">Already have an account? </span>
							<a href="/login" className="text-blue-2 hover:text-blue-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-2 underline">Log In</a>
						</div>
						<div className="error mt-4 text-red-500 text-sm text-center whitespace-pre-line">
							{registerError}
						</div>
					</div >
				</div >
			}
		</>
	)
};