import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { send } from 'micro';
import cookie from 'cookie';
import { AUTH_COOKIE_NAME } from '../../constants';
import getDiscordAuthorizeUrl from '../../lib/get-discord-authorize-url';

interface AuthorizeQuery {
	configurationId?: string;
	redirect_uri?: string;
	ownerId?: string;
	scope?: string;
}

/**
 * Handles a Discord authorization request generating a state and writing
 * context information to a cookie to later redirect to the Discord
 * authorization URL to complete the flow.
 */
export default function authorize(req: IncomingMessage, res: ServerResponse) {
	const { query }: { query: AuthorizeQuery } = parse(req.url!, true);

	if (!query.redirect_uri) {
		return send(res, 403, 'A query parameter `redirect_uri` is required');
	}

	if (!query.scope) {
		return send(res, 403, 'A query parameter `scope` is required');
	}

	if (!query.ownerId) {
		return send(res, 403, 'A query parameter `ownerId` is required');
	}

	if (!query.configurationId) {
		return send(
			res,
			403,
			'A query parameter `configurationId` is required'
		);
	}

	/**
	 * In the context we will need to store the url to redirect after the
	 * process is done and the ownerId to be able to retrieve the token
	 * to create the webhook during the callback. Also the configurationId
	 * is needed to associate it with the current install.
	 */
	const state = `state_${Math.random()}`;
	const redirectUrl = getDiscordAuthorizeUrl(query.scope, state);
	const context = {
		redirect_uri: query.redirect_uri,
		ownerId: query.ownerId,
		configurationId: query.configurationId,
		scope: query.scope,
		state
	};

	res.writeHead(302, {
		Location: redirectUrl,
		'Set-Cookie': cookie.serialize(
			AUTH_COOKIE_NAME,
			JSON.stringify(context),
			{ path: '/' }
		)
	});

	res.end('Redirecting...');
}
