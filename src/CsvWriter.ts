import { snapshot } from '@/snapshot';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { escape } from 'sqlstring';

type TableName = typeof snapshot.tables[number]['name'];

export class CsvWriter {
	constructor(private readonly outputPath: string) {}

	write<T extends object>(
		tableName: TableName,
		columnNames: readonly string[],
		items: T[],
	): Promise<void> {
		function escapeValue(value: unknown): string {
			switch (typeof value) {
				case 'boolean':
					return escape(value ? 1 : 0);
				default:
					return escape(value);
			}
		}

		const lines: string[] = [];
		lines.push(columnNames.join(','));
		for (const item of items) {
			lines.push(
				Object.values(item)
					.map((value) => escapeValue(value))
					.join(','),
			);
		}
		return writeFile(
			resolve(this.outputPath, `${tableName}.csv`),
			lines.join('\n'),
		);
	}
}
