export interface ArtistForAlbum {
	albumId: number;
	artistId: number | undefined;
	name: string | undefined;
	isSupport: boolean;
	roles: number;
}
