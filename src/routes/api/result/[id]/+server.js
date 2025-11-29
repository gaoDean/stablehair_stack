import { STABLEHAIR_API_KEY, STABLEHAIR_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
	const { id } = params;

	try {
		const response = await fetch(`${STABLEHAIR_API_URL}/result/${id}`, {
			method: 'GET',
			headers: {
				'X-API-Key': STABLEHAIR_API_KEY
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Result not found or expired');
			}
			throw error(response.status, 'Failed to retrieve result');
		}

		const blob = await response.blob();
		return new Response(blob, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	} catch (err) {
		console.error('Result Fetch Error:', err);
		if (err.status && err.body) throw err;
		throw error(500, 'Internal Server Error');
	}
};
