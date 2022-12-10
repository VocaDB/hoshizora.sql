import { ContentLanguageSelection } from '@/models/ContentLanguageSelection';
import { Embeddable, Enum, Property } from '@mikro-orm/core';

@Embeddable()
export class TranslatedString {
	@Enum(() => ContentLanguageSelection)
	defaultNameLanguage!: ContentLanguageSelection;

	@Property()
	japaneseName!: string;

	@Property()
	englishName!: string;

	@Property()
	romajiName!: string;
}
