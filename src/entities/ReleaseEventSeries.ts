import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { TranslatedString } from '@/entities/TranslatedString';

export interface ReleaseEventSeries extends TranslatedString {
	id: number;
	category: ReleaseEventCategory;
	description: string;
	mainPictureMime: string | undefined;
}
