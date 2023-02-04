interface PictureFile {
	created: Date;
	mime: string;
	name: string;
}

export interface AlbumPictureFile extends PictureFile {
	albumId: number;
}

export interface ArtistPictureFile extends PictureFile {
	artistId: number;
}
