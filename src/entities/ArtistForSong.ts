export interface ArtistForSong {
	songId: number;
	artistId: number | undefined;
	name: string | undefined;
	roles: number | undefined;
	isSupport: boolean;
}
