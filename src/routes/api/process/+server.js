import { STABLEHAIR_API_KEY, STABLEHAIR_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
	const formData = await request.formData();

	// Validate that required files are present
	if (!formData.has('target_image') || !formData.has('reference_image')) {
		throw error(400, 'Missing required files: target_image and reference_image');
	}

	try {
		const newFormData = new FormData();

		// Helper function to convert image to webp, ensuring correct EXIF orientation
		const convertToWebP = async (file) => {
			if (file && file instanceof File) {
				const buffer = await file.arrayBuffer();
				const convertedBuffer = await sharp(Buffer.from(buffer))
					.rotate() // Auto-orient based on EXIF data
					.webp({ quality: 60 })
					.toBuffer();
				return new Blob([convertedBuffer], { type: 'image/webp' });
			}
			return file;
		};

		const targetImage = formData.get('target_image');
		const referenceImage = formData.get('reference_image');

		if (targetImage instanceof File) {
			const convertedTarget = await convertToWebP(targetImage);
			newFormData.append('target_image', convertedTarget, 'target.webp');
		}

		if (referenceImage instanceof File) {
			const convertedReference = await convertToWebP(referenceImage);
			newFormData.append('reference_image', convertedReference, 'reference.webp');
		}

		// Append other fields if any (though currently only images are expected/validated)
		for (const [key, value] of formData.entries()) {
			if (key !== 'target_image' && key !== 'reference_image') {
				newFormData.append(key, value);
			}
		}

		const response = await fetch(`${STABLEHAIR_API_URL}/process`, {
			method: 'POST',
			headers: {
				'X-API-Key': STABLEHAIR_API_KEY
			},
			body: newFormData
		});

		if (!response.ok) {
			const text = await response.text();
			console.error(`StableHair API Error (${response.status}):`, text);
			throw error(response.status, `Upstream API error: ${text}`);
		}

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		console.error('Backend Proxy Error:', err);
		// If it's already a SvelteKit error, rethrow it
		if (err.status && err.body) throw err;
		throw error(500, 'Internal Server Error while communicating with StableHair API');
	}
};
