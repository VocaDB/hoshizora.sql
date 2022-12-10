import { PVService, PVType } from '@/entities/PV';

export interface ArchivedPVContract {
	author: string;
	disabled: boolean;
	extendedMetadata?: string;
	length: number;
	name: string;
	publishDate?: string;
	pvId: string;
	service: PVService;
	pvType: PVType;
	thumbUrl: string;
}
