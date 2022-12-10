import { WebLinkCategory } from '@/entities/WebLink';

export interface ArchivedWebLinkContract {
	category: WebLinkCategory;
	description: string;
	disabled: boolean;
	url: string;
}
