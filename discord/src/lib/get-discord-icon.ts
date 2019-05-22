import {Guild, User} from './discord-client';

export const getDiscordGuildIcon = (guild: Guild): string | null => {
	if (!guild.icon) {
		return `https://images.discordservers.com/image/server?name=${guild.name}`;
	}

	return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
};

export const getDiscordUserIcon = (user: User): string | null => {
	if (!user.icon) {
		return `https://cdn.discordapp.com/embed/avatars/${user.id}/${user.discriminator}.png`;
	}

	return `https://cdn.discordapp.com/avatars/${user.id}/${user.icon}.png`;
};
