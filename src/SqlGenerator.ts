import { snapshot } from '@/snapshot';
import { resolve } from 'node:path';

// https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type/49402091#49402091
type ValuesOfUnion<T> = T extends T ? T[keyof T] : never;

type TableColumns = typeof snapshot.tables[number]['columns'];
export type TableColumn = ValuesOfUnion<TableColumns>;

abstract class SqlGenerator {
	constructor(protected outputPath: string) {}

	abstract generateSql(): Generator<string>;
}

export class MariaDbSqlGenerator extends SqlGenerator {
	*generateSql(): Generator<string> {
		const tables = snapshot.tables;

		for (const table of tables) {
			yield `drop table if exists \`${table.name}\`;`;
		}

		for (const table of tables) {
			yield `create table \`${table.name}\` (${Object.entries(
				table.columns,
			)
				.map(([, value]: [string, TableColumn]) => {
					const result: string[] = [];
					result.push(`\`${value.name}\``);
					result.push(value.type);
					if (value.unsigned) {
						result.push('unsigned');
					}
					result.push(value.nullable ? 'null' : 'not null');
					if (value.autoincrement) {
						result.push('auto_increment');
					}
					if (value.primary) {
						result.push('primary key');
					}
					return `${result.join(' ')}`;
				})
				.join(', ')}) default character set utf8mb4 engine = InnoDB;`;
		}

		for (const table of tables) {
			yield `load data local infile '${resolve(
				this.outputPath,
				`${table.name}.csv`,
			)}' replace into table ${
				table.name
			} character set utf8mb4 fields terminated by ',' optionally enclosed by "'" ignore 1 lines;`;
		}

		for (const table of tables) {
			for (const index of table.indexes) {
				if (index.keyName === 'PRIMARY') {
					continue;
				}

				yield `alter table \`${table.name}\` add index \`${
					index.keyName
				}\`(${index.columnNames
					.map((columnName) => `\`${columnName}\``)
					.join(', ')});`;
			}
		}
	}
}

export class PostgresSqlGenerator extends SqlGenerator {
	*generateSql(): Generator<string> {
		const tables = snapshot.tables;

		for (const table of tables) {
			yield `drop table if exists ${table.name};`;
		}

		for (const table of tables) {
			yield `create table ${table.name} (${Object.entries(table.columns)
				.map(([, value]: [string, TableColumn]) => {
					const result: string[] = [];
					result.push(value.name);
					if (value.autoincrement) {
						result.push('serial');
					} else {
						switch (value.mappedType) {
							case 'enum':
								result.push('varchar(255)' /* TODO: enum */);
								break;
							case 'datetime':
								result.push('timestamp');
								break;
							case 'boolean':
								result.push('boolean');
								break;
							default:
								result.push(value.type);
								break;
						}
					}
					result.push(value.nullable ? 'null' : 'not null');
					if (value.primary) {
						result.push('primary key');
					}
					return `${result.join(' ')}`;
				})
				.join(', ')});`;
		}

		for (const table of tables) {
			yield `copy ${table.name} from '${resolve(
				this.outputPath,
				`${table.name}.csv`,
			)}' (format csv, header true, delimiter(','));`;
		}

		for (const table of tables) {
			for (const index of table.indexes) {
				if (index.keyName === 'PRIMARY') {
					continue;
				}

				yield `create index ${index.keyName} on ${
					table.name
				}(${index.columnNames
					.map((columnName) => columnName)
					.join(', ')});`;
			}
		}
	}
}
