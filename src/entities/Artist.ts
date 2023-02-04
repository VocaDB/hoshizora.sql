import { TranslatedString } from '@/entities/TranslatedString';

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
