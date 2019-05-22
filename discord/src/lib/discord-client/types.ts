export interface Guild {
	id: string;
	name: string;
	icon?: string;
}

export interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar?: string;
	accessToken: string;
}
