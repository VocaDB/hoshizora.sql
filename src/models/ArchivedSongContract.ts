import { TranslationType } from '@/entities/LyricsForSong';
import { SongType } from '@/entities/Song';
import { ArchivedPVContract } from '@/models/ArchivedPVContract';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import {
	AlbumForSongRefContract,
	ArchivedArtistForSongContract,
	ObjectRefContract,
} from '@/models/ObjectRefContract';

export interface LyricsForSongContract {
	cultureCode: string;
	id: number;
	source: string;
	translationType: TranslationType;
	url: string;
	value?: string;
}

export interface ArchivedSongContract {
	albums?: AlbumForSongRefContract[];
	artists?: ArchivedArtistForSongContract[];
	id: number;
	lengthSeconds: number;
	lyrics?: LyricsForSongContract[];
	maxMilliBpm?: number;
	minMilliBpm?: number;
	names?: LocalizedStringContract[];
	nicoId?: string;
	notes: string;
	notesEng: string;
	originalVersion?: ObjectRefContract;
	publishDate?: string;
	pvs?: ArchivedPVContract[];
	releaseEvent?: ObjectRefContract;
	songType: SongType;
	tags: ArchivedTagUsageContract[];
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
