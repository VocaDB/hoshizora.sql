import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default {
	highlighter: new SqlHighlighter(),
	metadataProvider: TsMorphMetadataProvider,
};
