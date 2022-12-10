import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';

export interface ArchivedReleaseEventSeriesContract {
	category: ReleaseEventCategory;
	description: string;
	id: number;
	mainPictureMime?: string;
	names?: LocalizedStringContract[];
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
