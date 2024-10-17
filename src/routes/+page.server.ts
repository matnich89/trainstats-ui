import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Construct the WebSocket URL based on the current request URL
	const wsUrl = `ws://${url.host}/api/ws`;

	return {
		wsUrl
	};
};
