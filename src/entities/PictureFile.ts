import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface PictureFile {
	id: number | undefined;
	created: Date;
	mime: string;
	name: string;
}

export const PictureFileTableColumnNames: readonly CamelToSnakeCase<
	keyof PictureFile
>[] = ['id', 'created', 'mime', 'name'] as const;

function PictureFileToString(pictureFile: PictureFile): string {
	const value: Record<typeof PictureFileTableColumnNames[number], string> = {
		id: escape(pictureFile.id),
		created: escape(pictureFile.created),
		mime: escape(pictureFile.mime),
		name: escape(pictureFile.name),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function PictureFilesToString(
	tableName: string,
	pictureFiles: PictureFile[],
): string {
	return `insert into ${tableName} (${PictureFileTableColumnNames.join(
		', ',
	)}) value\n${pictureFiles.map(PictureFileToString).join(',\n')};`;
}

export interface AlbumPictureFile extends PictureFile {
	albumId: number;
}

export interface ArtistPictureFile extends PictureFile {
	artistId: number;
}
