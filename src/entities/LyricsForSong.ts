export enum TranslationType {
	Original = 'Original',
	Romanized = 'Romanized',
	Translation = 'Translation',
}

export interface LyricsForSong {
	songId: number;
	source: string;
	text: string;
	cultureCode: string;
	translationType: TranslationType;
	url: string;
}
