import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { send } from 'micro';
import { AUTH_COOKIE_NAME } from '../../constants';
import getDiscordGuild from '../../lib/get-discord-guild';
import getDiscordUser from '../../lib/get-discord-user';
import getIntegrationConfig from '../../lib/mongodb/get-integration-config';
import getDiscordAccessToken from '../../lib/get-discord-access-token';
import saveIntegrationConfig from '../../lib/mongodb/save-integration-config';
import getWebhookHandler from '../../lib/get-webhook-handler';
import getZeitClient from '../../lib/zeit-client';

interface CallbackQuery {
	code?: string;
	error?: string;
	state?: string;
}

/**
 * Handles the callback after a Discord authorization exchanging the Discord code
 * for an access token. Then it creates a hook with the retrieved ZEIT token
 * and bind them together in the app. Finally it redirects to the redirect_uri url
 * which would be the integration UI.
 */
export default async function callback(
	req: IncomingMessage,
	res: ServerResponse
) {
	const { query } = parse(req.url!, true);
	const { code, state, error }: CallbackQuery = query;
	const cookies = cookie.parse(req.headers.cookie || '');
	const context = JSON.parse(cookies[AUTH_COOKIE_NAME] || '{}');

	if (error) {
		return send(res, 403, 'You must select a channel to send events');
	}

	if (!code || !state) {
		return send(res, 403, 'No code or state found');
	}

	if (state !== context.state) {
		return send(res, 403, 'Invalid state');
	}

	if (!context.ownerId) {
		return send(res, 403, 'No ownerId found to create ZEIT webhook');
	}

	if (!context.configurationId) {
		return send(
			res,
			403,
			'No configurationId found to create ZEIT webhook'
		);
	}

	// Exchange the code for an access token and ensure there is a webhook
	const tokenInfo = await getDiscordAccessToken(code, context.scope);
	const incomingWebhook = tokenInfo.webhook;
	if (!incomingWebhook) {
		throw new Error('The integration only support `incoming_webhook` scope');
	}

	const [user, guild] = await Promise.all([
		getDiscordUser(tokenInfo),
		getDiscordGuild(tokenInfo),
	]);

	// Get the integration configurationa and the zeit client to create a webhook
	const config = await getIntegrationConfig(context.ownerId);
	const zeit = getZeitClient(config);
	const zeitWebhook = await zeit.createWebhook({
		url: getWebhookHandler(incomingWebhook.url, config.ownerId),
		name: `Created from ZEIT Discord App to tunnel events`
	});

	// Store the configuration with the new webhook configured
	await saveIntegrationConfig({
		...config,
		webhooks: [
			...config.webhooks,
			{
				configurationId: context.configurationId,
				discordAuthorization: {
					accessToken: tokenInfo.access_token,
					scope: tokenInfo.scope,
					user,
					guild,
					webhook: incomingWebhook,
				},
				zeitWebhook
			}
		]
	});

	res.writeHead(302, {
		Location: `${decodeURIComponent(context.redirect_uri)}`,
		'Set-Cookie': cookie.serialize(AUTH_COOKIE_NAME, '', { path: '/' })
	});

	res.end('Redirecting...');
	return null;
}
