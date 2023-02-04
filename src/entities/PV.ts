import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export enum PVType {
	Original = 'Original',
	Reprint = 'Reprint',
	Other = 'Other',
}

export enum PVService {
	'NicoNicoDouga' = 'NicoNicoDouga',
	'Youtube' = 'Youtube',
	'SoundCloud' = 'SoundCloud',
	'Vimeo' = 'Vimeo',
	'Piapro' = 'Piapro',
	'Bilibili' = 'Bilibili',
	'File' = 'File',
	'LocalFile' = 'LocalFile',
	'Creofuga' = 'Creofuga',
	'Bandcamp' = 'Bandcamp',
}

export interface PV {
	id: number | undefined;
	author: string;
	name: string;
	pvId: string;
	pvType: PVType;
	service: PVService;
	extendedMetadata: string | undefined;
	publishDate: Date | undefined;
}

export const PVTableColumnNames: readonly CamelToSnakeCase<keyof PV>[] = [
	'id',
	'author',
	'name',
	'pv_id',
	'pv_type',
	'service',
	'extended_metadata',
	'publish_date',
] as const;

function PVToString(pv: PV): string {
	const value: Record<typeof PVTableColumnNames[number], string> = {
		id: escape(pv.id),
		author: escape(pv.author),
		name: escape(pv.name),
		pv_id: escape(pv.pvId),
		pv_type: escape(pv.pvType),
		service: escape(pv.service),
		extended_metadata: escape(pv.extendedMetadata),
		publish_date: escape(pv.publishDate),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function PVsToString(tableName: string, pvs: PV[]): string {
	return `insert into ${tableName} (${PVTableColumnNames.join(
		', ',
	)}) value\n${pvs.map(PVToString).join(',\n')};`;
}

export interface PVForAlbum extends PV {
	albumId: number;
}

export interface PVForReleaseEvent extends PV {
	releaseEventId: number;
}

export interface PVForSong extends PV {
	songId: number;
}
