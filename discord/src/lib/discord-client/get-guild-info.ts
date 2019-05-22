import nodeFetch from 'node-fetch';
import {Guild} from './types';

export default function createGetGuildInfo({token}: { token: string }) {
	return async function getGuildInfo(guildId: string): Promise<Guild> {
		const res = await nodeFetch(`https://discordapp.com/api/guilds/${guildId}`, {
			headers: {
				'Content-Type':  `application/x-www-form-urlencoded`,
				'Authorization': `Bearer ${token}`,
			},
			method:  'GET',
		});

		return await res.json();
	};
}
