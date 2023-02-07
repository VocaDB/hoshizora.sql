import { snapshot } from '@/snapshot';

export type TableName = typeof snapshot.tables[number]['name'];

export const TableNames: readonly TableName[] = snapshot.tables.flatMap(
	(table) => table.name,
);
