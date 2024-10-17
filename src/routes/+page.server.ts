import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
	return {
		wsUrl: process.env.VITE_WEBSOCKET_URL || null
	};
};
