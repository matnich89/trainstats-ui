import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const isDev = process.env.NODE_ENV === 'development';
	const wsHost = isDev ? 'localhost:8080' : url.host;
	const wsScheme = isDev ? 'ws' : 'wss';

	const wsUrl = `${wsScheme}://${wsHost}/passenger`;

	return {
		wsUrl
	};
};
