import { stringify } from 'querystring';

const { DISCORD_CLIENT_ID, HOOK_URL } = process.env;

/**
 * Allows to get a formatted authorization URL to authenticate with OAuth
 * in Discord so we can show the user the authorization screen that later
 * redirects to the callback URL.
 */
export default function getDiscordAuthorizeUrl(scope: string, state: string) {
	return `https://discordapp.com/api/oauth2/authorize?${stringify({
		client_id: DISCORD_CLIENT_ID,
		response_type: 'code',
		redirect_uri: `${HOOK_URL}/callback`,
		state,
		scope
	})}`;
}
