import { ContentLanguageSelection } from '@/models/ContentLanguageSelection';

export interface ArchivedTranslatedStringContract {
	default: string;
	defaultLanguage: ContentLanguageSelection;
	english: string;
	japanese: string;
	romaji: string;
}
