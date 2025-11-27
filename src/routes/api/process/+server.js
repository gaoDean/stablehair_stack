import { STABLEHAIR_API_KEY, STABLEHAIR_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
	const formData = await request.formData();

	// Validate that required files are present
	if (!formData.has('target_image') || !formData.has('reference_image')) {
		throw error(400, 'Missing required files: target_image and reference_image');
	}

	try {
		const response = await fetch(`${STABLEHAIR_API_URL}/process`, {
			method: 'POST',
			headers: {
				'X-API-Key': STABLEHAIR_API_KEY
			},
			body: formData
		});

		if (!response.ok) {
			const text = await response.text();
			console.error(`StableHair API Error (${response.status}):`, text);
			throw error(response.status, `Upstream API error: ${text}`);
		}

		// The API returns the image directly
		const blob = await response.blob();

		return new Response(blob, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	} catch (err) {
		console.error('Backend Proxy Error:', err);
		// If it's already a SvelteKit error, rethrow it
		if (err.status && err.body) throw err;
		throw error(500, 'Internal Server Error while communicating with StableHair API');
	}
};
