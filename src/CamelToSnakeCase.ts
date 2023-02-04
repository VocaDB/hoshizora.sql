// https://stackoverflow.com/questions/60269936/typescript-convert-generic-object-from-snake-to-camel-case/65642944#65642944
export type CamelToSnakeCase<S extends string> =
	S extends `${infer T}${infer U}`
		? `${T extends Capitalize<T>
				? '_'
				: ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
		: S;
