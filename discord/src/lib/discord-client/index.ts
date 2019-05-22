import buildGetGuildInfo from './get-guild-info';

export default function getDiscordClient({ token }: { token: string }) {
	return {
		getGuildInfo: buildGetGuildInfo({ token }),
	};
}

export type ZeitClient = ReturnType<typeof getDiscordClient>;
export * from './types';
