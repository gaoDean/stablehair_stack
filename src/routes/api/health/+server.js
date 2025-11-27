import { STABLEHAIR_API_KEY, STABLEHAIR_API_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	try {
		// Assuming the remote server exposes a /health endpoint
		const response = await fetch(`${STABLEHAIR_API_URL}/checkhealth`, {
			method: 'GET',
			headers: {
				'X-API-Key': STABLEHAIR_API_KEY
			}
		});

		if (response.ok) {
			return new Response(JSON.stringify({ status: 'online' }), {
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			// Try to get error text, but don't fail if it's not text
			const text = await response.text().catch(() => 'Unknown error');
			console.error(`Health Check Failed (${response.status}):`, text);
			return new Response(JSON.stringify({ status: 'offline', error: text }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (err) {
		console.error('Health Proxy Error:', err);
		return new Response(JSON.stringify({ status: 'offline', error: err.message }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
