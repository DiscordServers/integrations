export interface Guild {
	id: string;
	name: string;
	icon?: string;
}

export interface User {
	id: string;
	username: string;
	discriminator: string;
	icon?: string;
	accessToken: string;
}
