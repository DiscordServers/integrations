import fetch from 'node-fetch';
import { Guild } from './discord-client';
import { DiscordTokenInfo } from './get-discord-access-token';

export default async function getDiscordGuild(
	tokenInfo: DiscordTokenInfo
): Promise<Guild> {
	const response = await fetch(
		`https://discordapp.com/api/users/@me/guilds`,
		{
			headers: {
				Authorization: `Bearer ${tokenInfo.access_token}`
			}
		}
	);

	if (response.status !== 200) {
		throw new Error(
			`Invalid status code while fetching guild: ${
				response.status
			} error: ${await response.text()}`
		);
	}

	const guilds: Guild[] = await response.json();
	const guild = guilds.find(x => x.id === tokenInfo.webhook.guild_id);
	if (!guild) {
		throw new Error(
			"User doesn't appear to be in that guild. This shouldn't happen."
		);
	}

	return guild;
}
