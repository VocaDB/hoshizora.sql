export enum DiscMediaType {
	Audio = 'Audio',
	Video = 'Video',
}

export interface AlbumDiscProperties {
	albumId: number;
	discNumber: number;
	mediaType: DiscMediaType;
	name: string;
}
