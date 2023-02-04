import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

export enum ArtistType {
	'Unknown' = 'Unknown',
	'Circle' = 'Circle',
	'Label' = 'Label',
	'Producer' = 'Producer',
	'Animator' = 'Animator',
	'Illustrator' = 'Illustrator',
	'Lyricist' = 'Lyricist',
	'Vocaloid' = 'Vocaloid',
	'UTAU' = 'UTAU',
	'CeVIO' = 'CeVIO',
	'OtherVoiceSynthesizer' = 'OtherVoiceSynthesizer',
	'OtherVocalist' = 'OtherVocalist',
	'OtherGroup' = 'OtherGroup',
	'OtherIndividual' = 'OtherIndividual',
	'Utaite' = 'Utaite',
	'Band' = 'Band',
	'Vocalist' = 'Vocalist',
	'Character' = 'Character',
	'SynthesizerV' = 'SynthesizerV',
	'CoverArtist' = 'CoverArtist',
}

export interface Artist extends TranslatedString {
	id: number;
	artistType: ArtistType;
	baseVoicebankId: number | undefined;
	descriptionOriginal: string;
	descriptionEnglish: string;
	mainPictureMime: string | undefined;
	releaseDate: Date | undefined;
}

export const ArtistTableColumnNames: readonly CamelToSnakeCase<keyof Artist>[] =
	[
		'id',
		'artist_type',
		'base_voicebank_id',
		'description_original',
		'description_english',
		'main_picture_mime',
		'release_date',
		'default_name_language',
		'japanese_name',
		'english_name',
		'romaji_name',
	] as const;

function ArtistToString(artist: Artist): string {
	const value: Record<typeof ArtistTableColumnNames[number], string> = {
		id: escape(artist.id),
		artist_type: escape(artist.artistType),
		base_voicebank_id: escape(artist.baseVoicebankId),
		description_original: escape(artist.descriptionOriginal),
		description_english: escape(artist.descriptionEnglish),
		main_picture_mime: escape(artist.mainPictureMime),
		release_date: escape(artist.releaseDate),
		default_name_language: escape(artist.defaultNameLanguage),
		japanese_name: escape(artist.japaneseName),
		english_name: escape(artist.englishName),
		romaji_name: escape(artist.romajiName),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function ArtistsToString(artists: Artist[]): string {
	return `insert into artists (${ArtistTableColumnNames.join(
		', ',
	)}) value\n${artists.map(ArtistToString).join(',\n')};`;
}
