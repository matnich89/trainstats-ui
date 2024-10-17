import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Use localhost and port 8080 for local development
	const wsHost = process.env.NODE_ENV === 'development' ? 'localhost:8080' : url.host;
	const wsProtocol = process.env.NODE_ENV === 'development' ? 'ws' : url.protocol === 'https:' ? 'wss' : 'ws';

	const wsUrl = `${wsProtocol}://${wsHost}/national`;

	return {
		wsUrl
	};
};
