import { ContentLanguageSelection } from '@/models/ContentLanguageSelection';

export interface TranslatedString {
	defaultNameLanguage: ContentLanguageSelection;
	japaneseName: string;
	englishName: string;
	romajiName: string;
}
