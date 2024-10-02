export const debounce = (func: any, wait = 100) => {
	let timeout: NodeJS.Timeout | null = null;
	return function (event: Event) {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(func, wait, event);
	};
};
