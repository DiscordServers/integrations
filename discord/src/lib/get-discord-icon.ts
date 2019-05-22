import {Guild} from './discord-client';

export const getDiscordGuildIcon = (guild: Guild): string | null => {
	if (!guild.icon) {
		return `https://images.discordservers.com/image/server?name=${
			guild.name
			}`;
	}

	return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
};
