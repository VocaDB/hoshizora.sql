import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';

export interface ArchivedReleaseEventSeriesContract {
	category: ReleaseEventCategory;
	description: string;
	id: number;
	mainPictureMime?: string;
	names?: LocalizedStringContract[];
	tags: ArchivedTagUsageContract[];
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
