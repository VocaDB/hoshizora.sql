import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { ArchivedPVContract } from '@/models/ArchivedPVContract';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import {
	ArchivedArtistForReleaseEventContract,
	ObjectRefContract,
} from '@/models/ObjectRefContract';

export interface ArchivedReleaseEventContract {
	artists?: ArchivedArtistForReleaseEventContract[];
	category: ReleaseEventCategory;
	date?: string;
	description: string;
	id: number;
	mainPictureMime?: string;
	name?: string;
	names?: LocalizedStringContract[];
	pvs?: ArchivedPVContract[];
	series?: ObjectRefContract;
	seriesNumber: number;
	songList?: ObjectRefContract;
	tags: ArchivedTagUsageContract[];
	translatedName: ArchivedTranslatedStringContract;
	venue?: ObjectRefContract;
	venueName?: string;
	webLinks?: ArchivedWebLinkContract[];
}
