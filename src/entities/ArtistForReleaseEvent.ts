export interface ArtistForReleaseEvent {
	releaseEventId: number;
	artistId: number | undefined;
	name: string | undefined;
	roles: number;
}
