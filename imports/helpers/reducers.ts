export const fullName = (user:any) => {
	const firstName = user?.firstName || "";
	const lastName = user?.lastName || "";
	const lastInitial = lastName ? lastName.charAt(0) : "";
	return firstName + (lastInitial ? " " + lastInitial : "");
}
