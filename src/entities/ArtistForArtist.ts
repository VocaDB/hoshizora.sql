export enum ArtistLinkType {
	'CharacterDesigner' = 'CharacterDesigner',
	'Group' = 'Group',
	'Illustrator' = 'Illustrator',
	'Manager' = 'Manager',
	'VoiceProvider' = 'VoiceProvider',
}

export interface ArtistForArtist {
	memberId: number;
	groupId: number;
	linkType: ArtistLinkType;
}
