// Import environment variables
let OPENAI_KEY = process.env.OPENAI_KEY;

import { get } from 'svelte/store';

import type { CreateCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import { getTokens } from '$lib/tokenizer';
import { json } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Check if API key is set
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env variable not set');
		}

		// Parse the request data
		const requestData = await request.json();

		if (!requestData) {
			throw new Error('No request data');
		}

		const reqMessages: string[] = requestData.messages.map((msg: { content: string }) => msg.content);

		if (!reqMessages) {
			throw new Error('No messages provided');
		}

		let tokenCount = 0;

		reqMessages.forEach((msg) => {
			const tokens = getTokens(msg);
			tokenCount += tokens;
		});

		// Perform moderation check
		const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_KEY}`
			},
			method: 'POST',
			body: JSON.stringify({
				input: reqMessages[reqMessages.length - 1]
			})
		});

		const moderationData = await moderationRes.json();
		const [results] = moderationData.results;

		if (results.flagged) {
			throw new Error('Query flagged by OpenAI');
		}

		// Construct prompt
		let prompt = `Act as Natalie Schmidt, a 35-year-old IT company executive and web designer. You work for a medium-sized IT company and often participate in EU projects, which means you travel frequently. Despite your busy schedule, you always find time to visit museums, particularly art museums, to relax and refresh between meetings. You have a keen interest in art, history, and sociology, and you try to read about these subjects during your spare time. When visiting museums, you prefer to quickly browse through collections and focus on specific exhibits that catch your interest. If possible, you prepare for your museum visits by researching online beforehand. You avoid guided tours as they can be stressful when your time is limited, preferring the flexibility of exploring on your own. Your goals as Natalie: To relax and enjoy aesthetically pleasing objects in museums. To learn new and interesting facts about topics that fascinate you, such as art and history. To have easy access to relevant information that helps you prepare for your museum visits. To make the most of the limited time you have during museum visits.`; // Keep the rest of your prompt as needed

		if (tokenCount >= 4000) {
			prompt = prompt.substring(0, 8000);
			tokenCount = getTokens(prompt);
		}

		if (tokenCount >= 4000) {
			throw new Error('Query too large');
		}

		// Create the completion request
		const completionRequestOpts: CreateCompletionRequest = {
			model: 'davinci-002',
			prompt: prompt + reqMessages.join('\n'),
			temperature: 0.9,
			max_tokens: 4000 - tokenCount,
			stream: true
		};

		// Make the API request to OpenAI
		const completionResponse = await fetch('https://api.openai.com/v1/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionRequestOpts)
		});

		if (!completionResponse.ok) {
			const err = await completionResponse.json();
			throw new Error(err);
		}

		// Stream the response back to the client
		return new Response(completionResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.error(err);
		return json({ error: 'There was an error processing your request' }, { status: 500 });
	}
};
