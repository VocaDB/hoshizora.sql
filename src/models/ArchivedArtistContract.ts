import { ArtistType } from '@/entities/Artist';
import { ArchivedEntryPictureFileContract } from '@/models/ArchivedEntryPictureFileContract';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import {
	ArchivedArtistForArtistContract,
	ObjectRefContract,
} from '@/models/ObjectRefContract';

export interface ArchivedArtistContract {
	artistType: ArtistType;
	baseVoicebank?: ObjectRefContract;
	description?: string;
	descriptionEng?: string;
	groups: ArchivedArtistForArtistContract[];
	id: number;
	mainPictureMime?: string;
	members: ObjectRefContract[];
	names?: LocalizedStringContract[];
	pictures?: ArchivedEntryPictureFileContract[];
	releaseDate?: string;
	tags: ArchivedTagUsageContract[];
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
