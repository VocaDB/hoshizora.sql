import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class EnglishTranslatedString {
	@Property({ type: 'text' })
	original!: string;

	@Property({ type: 'text' })
	english!: string;
}
