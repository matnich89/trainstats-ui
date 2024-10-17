import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Construct the WebSocket URL based on the current request URL
	const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsUrl = `${wsProtocol}//${url.host}/api/ws`;

	return {
		wsUrl
	};
};
