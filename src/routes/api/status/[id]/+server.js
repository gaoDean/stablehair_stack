import { STABLEHAIR_API_KEY, STABLEHAIR_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
    const { id } = params;

    try {
        const response = await fetch(`${STABLEHAIR_API_URL}/status/${id}`, {
            method: 'GET',
            headers: {
                'X-API-Key': STABLEHAIR_API_KEY
            }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to check job status');
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Status Check Error:', err);
        if (err.status && err.body) throw err;
        throw error(500, 'Internal Server Error');
    }
};
