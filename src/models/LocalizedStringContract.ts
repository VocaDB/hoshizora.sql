import { ContentLanguageSelection } from '@/models/ContentLanguageSelection';

export interface LocalizedStringContract {
	language: ContentLanguageSelection;
	value: string;
}
