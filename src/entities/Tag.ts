import { TranslatedString } from '@/entities/TranslatedString';

export interface Tag extends TranslatedString {
	id: number;
	categoryName: string;
	descriptionOriginal: string;
	descriptionEnglish: string;
	hideFromSuggestions: boolean;
	parentId: number | undefined;
	targets: number;
	thumbMime: string | undefined;
}
