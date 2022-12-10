import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import { ObjectRefContract } from '@/models/ObjectRefContract';

export interface ArchivedTagContract {
	categoryName: string;
	description?: string;
	descriptionEng?: string;
	hideFromSuggestions: boolean;
	id: number;
	names?: LocalizedStringContract[];
	parent?: ObjectRefContract;
	relatedTags?: ObjectRefContract[];
	targets: number;
	thumbMime?: string;
	translatedName: ArchivedTranslatedStringContract;
	webLinks?: ArchivedWebLinkContract[];
}
