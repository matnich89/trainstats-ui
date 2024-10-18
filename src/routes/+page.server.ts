import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Use localhost and port 8080 for local development
	const wsHost = process.env.NODE_ENV === 'development' ? 'localhost:8080' : url.host;

	const wsUrl = `wss://${wsHost}/national`;

	return {
		wsUrl
	};
};
