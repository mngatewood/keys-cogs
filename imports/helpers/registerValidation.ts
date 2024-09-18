export const validateName = (firstName: string) => {
	if (firstName.length < 1) {
		return false;
	 } else {
		return String(firstName)
			.toLowerCase()
			.match(/^[a-zA-Z\s-]+$/);
	 };
}


export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

export const validatePassword = (password: string) => {
	const longEnough = password.length >= 6;
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	if (!longEnough) {
		return { valid: false, error: "Password must be at least 6 characters in length" };
	} else if (!hasUppercase) {
		return { valid: false, error: "Password must contain at least one uppercase letter" };
	} else if (!hasLowercase) {
		return { valid: false, error: "Password must contain at least one lowercase letter" };
	} else {
		return { valid: true, error: "" };
	}
};