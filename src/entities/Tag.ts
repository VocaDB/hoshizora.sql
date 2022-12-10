import { EnglishTranslatedString } from '@/entities/EnglishTranslatedString';
import { TagName } from '@/entities/Name';
import { RelatedTag } from '@/entities/RelatedTag';
import { TranslatedString } from '@/entities/TranslatedString';
import { TagWebLink } from '@/entities/WebLink';
import {
	Collection,
	Embedded,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

@Entity({ tableName: 'tags' })
export class Tag {
	@PrimaryKey()
	id!: number;

	@Property({ length: 30 })
	categoryName!: string;

	@Embedded()
	description!: EnglishTranslatedString;

	@Property()
	hideFromSuggestions!: boolean;

	@OneToMany(() => TagName, (name) => name.tag)
	names = new Collection<TagName>(this);

	@ManyToOne()
	parent?: Ref<Tag>;

	@OneToMany(() => RelatedTag, (relatedTag) => relatedTag.ownerTag)
	relatedTags = new Collection<RelatedTag>(this);

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	@Property()
	targets!: number;

	@Property({ length: 30 })
	thumbMime?: string;

	@OneToMany(() => TagWebLink, (webLink) => webLink.tag)
	webLinks = new Collection<TagWebLink>(this);
}
