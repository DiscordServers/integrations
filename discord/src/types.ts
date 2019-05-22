import { Guild, User } from './lib/discord-client';
import { Webhook } from './lib/zeit-client';

export interface DiscordAuthorization {
	accessToken: string;
	scope: string;
	user: User;
	guild: Guild;
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

export interface IntegrationConfig {
	ownerId: string;
	userId: string;
	teamId?: string | null;
	zeitToken: string;
	webhooks: {
		configurationId: string;
		discordAuthorization: DiscordAuthorization;
		zeitWebhook: Webhook;
	}[];
}
