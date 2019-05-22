import { stringify } from 'querystring';
import { SCOPE } from '../constants';

const { HOOK_URL } = process.env;

/**
 * Allows to get a formatted authorization URL that later redirects to Slack.
 * It includes in the query string the requested scope, the ownerId and
 * the redirection URL for when the process is done.
 */
export default function getAuthorizeUri({
	scope = `${SCOPE.INCOMING_WEBHOOK} ${SCOPE.IDENTIFY} ${SCOPE.GUILDS}`,
	configurationId,
	ownerId,
	redirect_uri
}: {
	scope?: string;
	configurationId: string;
	ownerId: string;
	redirect_uri: string;
}) {
	return `${HOOK_URL}/authorize?${stringify({
		redirect_uri,
		ownerId,
		scope,
		configurationId,
		response_type: 'code'
	})}`;
}
