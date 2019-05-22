import fetch from 'node-fetch';
import { User } from './discord-client';
import { DiscordTokenInfo } from './get-discord-access-token';

export default async function getDiscordUser(
	tokenInfo: DiscordTokenInfo
): Promise<User> {
	const response = await fetch('https://discordapp.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${tokenInfo.access_token}`
		}
	});

	if (response.status !== 200) {
		throw new Error(
			`Invalid status code while fetching user: ${
				response.status
			} error: ${await response.text()}`
		);
	}

	return await response.json();
}
