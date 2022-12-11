import { DiscType } from '@/entities/Album';
import { DiscMediaType } from '@/entities/AlbumDiscProperties';
import { ArchivedEntryPictureFileContract } from '@/models/ArchivedEntryPictureFileContract';
import { ArchivedPVContract } from '@/models/ArchivedPVContract';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import {
	ArchivedArtistForAlbumContract,
	ObjectRefContract,
	SongInAlbumRefContract,
} from '@/models/ObjectRefContract';
import { OptionalDateTimeContract } from '@/models/OptionalDateTimeContract';

export interface AlbumDiscPropertiesContract {
	discNumber: number;
	id: number;
	mediaType: DiscMediaType;
	name: string;
}

export interface AlbumIdentifierContract {
	value: string;
}

export interface ArchivedAlbumReleaseContract {
	catNum?: string;
	releaseDate?: OptionalDateTimeContract;
	releaseEvent?: ObjectRefContract;
}

export interface ArchivedAlbumContract {
	artists?: ArchivedArtistForAlbumContract[];
	description?: string;
	descriptionEng?: string;
	discs?: AlbumDiscPropertiesContract[];
	discType: DiscType;
	id: number;
	identifiers?: AlbumIdentifierContract[];
	mainPictureMime?: string;
	names?: LocalizedStringContract[];
	originalRelease?: ArchivedAlbumReleaseContract;
	pictures?: ArchivedEntryPictureFileContract[];
	pvs?: ArchivedPVContract[];
	songs?: SongInAlbumRefContract[];
	tags: ArchivedTagUsageContract[];
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
