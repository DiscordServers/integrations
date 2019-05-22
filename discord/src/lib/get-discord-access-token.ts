import fetch from 'node-fetch';
import { stringify } from 'querystring';

const { HOOK_URL } = process.env;

export interface DiscordTokenInfo {
	token_type: string;
	access_token: string;
	scope: string;
	expires_in: number;
	refresh_token: string;
	webhook: {
		name: string;
		url: string;
		channel_id: string;
		token: string;
		avatar?: string;
		guild_id: string;
		id: string;
	};
}

/**
 * Allows to exchange a Discord authorization code for an actual token. It is
 * assumed that the token has the scope of incoming webhook as that's the
 * only feature we include for now.
 */
export default async function getAccessToken(
	code: string,
	scope: string
): Promise<DiscordTokenInfo> {
	const response = await fetch('https://discordapp.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		body: stringify({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: `${HOOK_URL}/callback`,
			code,
			scope
		})
	});

	if (response.status !== 200) {
		throw new Error(
			`Invalid status code while getting token: ${
				response.status
			} error: ${await response.text()}`
		);
	}

	return await response.json();
}
