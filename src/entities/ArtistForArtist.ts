import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export enum ArtistLinkType {
	'CharacterDesigner' = 'CharacterDesigner',
	'Group' = 'Group',
	'Illustrator' = 'Illustrator',
	'Manager' = 'Manager',
	'VoiceProvider' = 'VoiceProvider',
}

export interface ArtistForArtist {
	id: number | undefined;
	groupId: number;
	memberId: number;
	linkType: ArtistLinkType;
}

export const ArtistForArtistTableColumnNames: readonly CamelToSnakeCase<
	keyof ArtistForArtist
>[] = ['id', 'group_id', 'member_id', 'link_type'] as const;

function ArtistForArtistToString(artistForArtist: ArtistForArtist): string {
	const value: Record<
		typeof ArtistForArtistTableColumnNames[number],
		string
	> = {
		id: escape(artistForArtist.id),
		group_id: escape(artistForArtist.groupId),
		member_id: escape(artistForArtist.memberId),
		link_type: escape(artistForArtist.linkType),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function ArtistsForArtistToString(
	artistsForArtist: ArtistForArtist[],
): string {
	return `insert into artists_for_artists (${ArtistForArtistTableColumnNames.join(
		', ',
	)}) value\n${artistsForArtist.map(ArtistForArtistToString).join(',\n')};`;
}
