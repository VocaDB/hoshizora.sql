import { Migration } from '@mikro-orm/migrations';

export class Migration20221210103729 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `artists` (`id` int unsigned not null auto_increment primary key, `artist_type` enum('Unknown', 'Circle', 'Label', 'Producer', 'Animator', 'Illustrator', 'Lyricist', 'Vocaloid', 'UTAU', 'CeVIO', 'OtherVoiceSynthesizer', 'OtherVocalist', 'OtherGroup', 'OtherIndividual', 'Utaite', 'Band', 'Vocalist', 'Character', 'SynthesizerV', 'CoverArtist') not null, `base_voicebank_id` int unsigned null, `description_original` text not null, `description_english` text not null, `main_picture_mime` varchar(32) null, `release_date` datetime null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `artists` add index `artists_base_voicebank_id_index`(`base_voicebank_id`);',
		);

		this.addSql(
			"create table `artists_for_artists` (`id` int unsigned not null auto_increment primary key, `group_id` int unsigned not null, `member_id` int unsigned not null, `link_type` enum('CharacterDesigner', 'Group', 'Illustrator', 'Manager', 'VoiceProvider') not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `artists_for_artists` add index `artists_for_artists_group_id_index`(`group_id`);',
		);
		this.addSql(
			'alter table `artists_for_artists` add index `artists_for_artists_member_id_index`(`member_id`);',
		);

		this.addSql(
			'create table `artist_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artist_names` add index `artist_names_artist_id_index`(`artist_id`);',
		);

		this.addSql(
			'create table `artist_picture_files` (`id` int unsigned not null auto_increment primary key, `created` datetime not null, `mime` varchar(32) not null, `name` varchar(200) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artist_picture_files` add index `artist_picture_files_artist_id_index`(`artist_id`);',
		);

		this.addSql(
			"create table `artist_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `artist_web_links` add index `artist_web_links_artist_id_index`(`artist_id`);',
		);

		this.addSql(
			"create table `release_event_series` (`id` int unsigned not null auto_increment primary key, `category` enum('Unspecified', 'AlbumRelease', 'Anniversary', 'Club', 'Concert', 'Contest', 'Convention', 'Other', 'Festival') not null, `description` text not null, `main_picture_mime` varchar(32) null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;",
		);

		this.addSql(
			"create table `release_events` (`id` int unsigned not null auto_increment primary key, `category` enum('Unspecified', 'AlbumRelease', 'Anniversary', 'Club', 'Concert', 'Contest', 'Convention', 'Other', 'Festival') not null, `date` datetime null, `description` text not null, `main_picture_mime` varchar(32) null, `series_id` int unsigned null, `series_number` int not null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null, `venue_name` varchar(1000) null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `release_events` add index `release_events_series_id_index`(`series_id`);',
		);

		this.addSql(
			'create table `release_event_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `release_event_names` add index `release_event_names_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			"create table `pvs_for_release_events` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `pvs_for_release_events` add index `pvs_for_release_events_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			'create table `artists_for_release_events` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `name` varchar(255) null, `roles` int not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artists_for_release_events` add index `artists_for_release_events_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `artists_for_release_events` add index `artists_for_release_events_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			"create table `albums` (`id` int unsigned not null auto_increment primary key, `description_original` text not null, `description_english` text not null, `disc_type` enum('Unknown', 'Album', 'Single', 'EP', 'SplitAlbum', 'Compilation', 'Video', 'Artbook', 'Game', 'Fanmade', 'Instrumental', 'Other') not null, `main_picture_mime` varchar(32) null, `original_release_cat_num` varchar(50) null, `original_release_day` int null, `original_release_month` int null, `original_release_release_event_id` int unsigned null, `original_release_year` int null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `albums` add index `albums_original_release_release_event_id_index`(`original_release_release_event_id`);',
		);

		this.addSql(
			"create table `pvs_for_albums` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `pvs_for_albums` add index `pvs_for_albums_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `artists_for_albums` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `album_id` int unsigned not null, `name` varchar(255) null, `is_support` tinyint(1) not null, `roles` int not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artists_for_albums` add index `artists_for_albums_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `artists_for_albums` add index `artists_for_albums_album_id_index`(`album_id`);',
		);

		this.addSql(
			"create table `album_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `album_web_links` add index `album_web_links_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `album_picture_files` (`id` int unsigned not null auto_increment primary key, `created` datetime not null, `mime` varchar(32) not null, `name` varchar(200) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `album_picture_files` add index `album_picture_files_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `album_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `album_names` add index `album_names_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `album_identifiers` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `value` varchar(50) not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `album_identifiers` add index `album_identifiers_album_id_index`(`album_id`);',
		);

		this.addSql(
			"create table `album_disc_properties` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `disc_number` int not null, `media_type` enum('Audio', 'Video') not null, `name` varchar(200) not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `album_disc_properties` add index `album_disc_properties_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `release_event_series_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `release_event_series_names` add index `release_event_series_names_release_event_series_id_index`(`release_event_series_id`);',
		);

		this.addSql(
			"create table `release_event_series_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `release_event_series_web_links` add index `release_event_series_web_links_release_event_series_id_index`(`release_event_series_id`);',
		);

		this.addSql(
			"create table `release_event_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `release_event_web_links` add index `release_event_web_links_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			"create table `songs` (`id` int unsigned not null auto_increment primary key, `length_seconds` int not null, `max_milli_bpm` int null, `min_milli_bpm` int null, `nico_id` varchar(20) null, `notes_original` text not null, `notes_english` text not null, `original_version_id` int unsigned null, `publish_date` datetime null, `release_event_id` int unsigned null, `song_type` enum('Unspecified', 'Original', 'Remaster', 'Remix', 'Cover', 'Arrangement', 'Instrumental', 'Mashup', 'MusicPV', 'DramaPV', 'Live', 'Illustration', 'Other') not null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `songs` add index `songs_original_version_id_index`(`original_version_id`);',
		);
		this.addSql(
			'alter table `songs` add index `songs_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			"create table `pvs_for_songs` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `pvs_for_songs` add index `pvs_for_songs_song_id_index`(`song_id`);',
		);

		this.addSql(
			"create table `lyrics_for_songs` (`id` int unsigned not null auto_increment primary key, `song_id` int unsigned not null, `source` varchar(255) not null, `text` text not null, `culture_code` varchar(10) not null, `translation_type` enum('Original', 'Romanized', 'Translation') not null, `url` varchar(500) not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `lyrics_for_songs` add index `lyrics_for_songs_song_id_index`(`song_id`);',
		);

		this.addSql(
			'create table `artists_for_songs` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `name` varchar(255) null, `roles` int not null, `song_id` int unsigned not null, `is_support` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artists_for_songs` add index `artists_for_songs_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `artists_for_songs` add index `artists_for_songs_song_id_index`(`song_id`);',
		);

		this.addSql(
			'create table `songs_in_albums` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `disc_number` int not null, `name` varchar(255) null, `song_id` int unsigned null, `track_number` int not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `songs_in_albums` add index `songs_in_albums_album_id_index`(`album_id`);',
		);
		this.addSql(
			'alter table `songs_in_albums` add index `songs_in_albums_song_id_index`(`song_id`);',
		);

		this.addSql(
			'create table `song_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `song_names` add index `song_names_song_id_index`(`song_id`);',
		);

		this.addSql(
			"create table `song_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `song_web_links` add index `song_web_links_song_id_index`(`song_id`);',
		);

		this.addSql(
			"create table `tags` (`id` int unsigned not null auto_increment primary key, `category_name` varchar(30) not null, `description_original` text not null, `description_english` text not null, `hide_from_suggestions` tinyint(1) not null, `parent_id` int unsigned null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null, `targets` int not null, `thumb_mime` varchar(30) null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `tags` add index `tags_parent_id_index`(`parent_id`);',
		);

		this.addSql(
			'create table `song_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `song_tag_usages` add index `song_tag_usages_tag_id_index`(`tag_id`);',
		);
		this.addSql(
			'alter table `song_tag_usages` add index `song_tag_usages_song_id_index`(`song_id`);',
		);

		this.addSql(
			'create table `release_event_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `release_event_tag_usages` add index `release_event_tag_usages_tag_id_index`(`tag_id`);',
		);
		this.addSql(
			'alter table `release_event_tag_usages` add index `release_event_tag_usages_release_event_id_index`(`release_event_id`);',
		);

		this.addSql(
			'create table `release_event_series_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `release_event_series_tag_usages` add index `release_event_series_tag_usages_tag_id_index`(`tag_id`);',
		);
		this.addSql(
			'alter table `release_event_series_tag_usages` add index `release_event_series_tag_usages_release_event_series_id_index`(`release_event_series_id`);',
		);

		this.addSql(
			'create table `related_tags` (`id` int unsigned not null auto_increment primary key, `owner_tag_id` int unsigned not null, `linked_tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `related_tags` add index `related_tags_owner_tag_id_index`(`owner_tag_id`);',
		);
		this.addSql(
			'alter table `related_tags` add index `related_tags_linked_tag_id_index`(`linked_tag_id`);',
		);

		this.addSql(
			'create table `artist_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `artist_tag_usages` add index `artist_tag_usages_tag_id_index`(`tag_id`);',
		);
		this.addSql(
			'alter table `artist_tag_usages` add index `artist_tag_usages_artist_id_index`(`artist_id`);',
		);

		this.addSql(
			'create table `album_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `album_tag_usages` add index `album_tag_usages_tag_id_index`(`tag_id`);',
		);
		this.addSql(
			'alter table `album_tag_usages` add index `album_tag_usages_album_id_index`(`album_id`);',
		);

		this.addSql(
			'create table `tag_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `tag_names` add index `tag_names_tag_id_index`(`tag_id`);',
		);

		this.addSql(
			"create table `tag_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `tag_web_links` add index `tag_web_links_tag_id_index`(`tag_id`);',
		);

		/*this.addSql(
			'alter table `artists` add constraint `artists_base_voicebank_id_foreign` foreign key (`base_voicebank_id`) references `artists` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `artists_for_artists` add constraint `artists_for_artists_group_id_foreign` foreign key (`group_id`) references `artists` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `artists_for_artists` add constraint `artists_for_artists_member_id_foreign` foreign key (`member_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artist_names` add constraint `artist_names_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artist_picture_files` add constraint `artist_picture_files_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artist_web_links` add constraint `artist_web_links_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_events` add constraint `release_events_series_id_foreign` foreign key (`series_id`) references `release_event_series` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `release_event_names` add constraint `release_event_names_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `pvs_for_release_events` add constraint `pvs_for_release_events_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artists_for_release_events` add constraint `artists_for_release_events_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `artists_for_release_events` add constraint `artists_for_release_events_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `albums` add constraint `albums_original_release_release_event_id_foreign` foreign key (`original_release_release_event_id`) references `release_events` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `pvs_for_albums` add constraint `pvs_for_albums_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artists_for_albums` add constraint `artists_for_albums_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `artists_for_albums` add constraint `artists_for_albums_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_web_links` add constraint `album_web_links_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_picture_files` add constraint `album_picture_files_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_names` add constraint `album_names_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_identifiers` add constraint `album_identifiers_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_disc_properties` add constraint `album_disc_properties_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_event_series_names` add constraint `release_event_series_names_release_event_series_id_foreign` foreign key (`release_event_series_id`) references `release_event_series` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_event_series_web_links` add constraint `release_event_series_web_links_release_event_series_id_foreign` foreign key (`release_event_series_id`) references `release_event_series` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_event_web_links` add constraint `release_event_web_links_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `songs` add constraint `songs_original_version_id_foreign` foreign key (`original_version_id`) references `songs` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `songs` add constraint `songs_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `pvs_for_songs` add constraint `pvs_for_songs_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `lyrics_for_songs` add constraint `lyrics_for_songs_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artists_for_songs` add constraint `artists_for_songs_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `artists_for_songs` add constraint `artists_for_songs_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `songs_in_albums` add constraint `songs_in_albums_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `songs_in_albums` add constraint `songs_in_albums_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `song_names` add constraint `song_names_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `song_web_links` add constraint `song_web_links_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `tags` add constraint `tags_parent_id_foreign` foreign key (`parent_id`) references `tags` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `song_tag_usages` add constraint `song_tag_usages_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `song_tag_usages` add constraint `song_tag_usages_song_id_foreign` foreign key (`song_id`) references `songs` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_event_tag_usages` add constraint `release_event_tag_usages_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `release_event_tag_usages` add constraint `release_event_tag_usages_release_event_id_foreign` foreign key (`release_event_id`) references `release_events` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `release_event_series_tag_usages` add constraint `release_event_series_tag_usages_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `release_event_series_tag_usages` add constraint `release_event_series_tag_usages_release_event_series_id_foreign` foreign key (`release_event_series_id`) references `release_event_series` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `related_tags` add constraint `related_tags_owner_tag_id_foreign` foreign key (`owner_tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `related_tags` add constraint `related_tags_linked_tag_id_foreign` foreign key (`linked_tag_id`) references `tags` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artist_tag_usages` add constraint `artist_tag_usages_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `artist_tag_usages` add constraint `artist_tag_usages_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `album_tag_usages` add constraint `album_tag_usages_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `album_tag_usages` add constraint `album_tag_usages_album_id_foreign` foreign key (`album_id`) references `albums` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `tag_names` add constraint `tag_names_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `tag_web_links` add constraint `tag_web_links_tag_id_foreign` foreign key (`tag_id`) references `tags` (`id`) on update cascade;',
		);*/
	}

	async down(): Promise<void> {
		/*this.addSql(
			'alter table `artists` drop foreign key `artists_base_voicebank_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_artists` drop foreign key `artists_for_artists_group_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_artists` drop foreign key `artists_for_artists_member_id_foreign`;',
		);

		this.addSql(
			'alter table `artist_names` drop foreign key `artist_names_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artist_picture_files` drop foreign key `artist_picture_files_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artist_web_links` drop foreign key `artist_web_links_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_release_events` drop foreign key `artists_for_release_events_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_albums` drop foreign key `artists_for_albums_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_songs` drop foreign key `artists_for_songs_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `artist_tag_usages` drop foreign key `artist_tag_usages_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `release_events` drop foreign key `release_events_series_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_series_names` drop foreign key `release_event_series_names_release_event_series_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_series_web_links` drop foreign key `release_event_series_web_links_release_event_series_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_series_tag_usages` drop foreign key `release_event_series_tag_usages_release_event_series_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_names` drop foreign key `release_event_names_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `pvs_for_release_events` drop foreign key `pvs_for_release_events_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_release_events` drop foreign key `artists_for_release_events_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `albums` drop foreign key `albums_original_release_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_web_links` drop foreign key `release_event_web_links_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `songs` drop foreign key `songs_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_tag_usages` drop foreign key `release_event_tag_usages_release_event_id_foreign`;',
		);

		this.addSql(
			'alter table `pvs_for_albums` drop foreign key `pvs_for_albums_album_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_albums` drop foreign key `artists_for_albums_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_web_links` drop foreign key `album_web_links_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_picture_files` drop foreign key `album_picture_files_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_names` drop foreign key `album_names_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_identifiers` drop foreign key `album_identifiers_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_disc_properties` drop foreign key `album_disc_properties_album_id_foreign`;',
		);

		this.addSql(
			'alter table `songs_in_albums` drop foreign key `songs_in_albums_album_id_foreign`;',
		);

		this.addSql(
			'alter table `album_tag_usages` drop foreign key `album_tag_usages_album_id_foreign`;',
		);

		this.addSql(
			'alter table `songs` drop foreign key `songs_original_version_id_foreign`;',
		);

		this.addSql(
			'alter table `pvs_for_songs` drop foreign key `pvs_for_songs_song_id_foreign`;',
		);

		this.addSql(
			'alter table `lyrics_for_songs` drop foreign key `lyrics_for_songs_song_id_foreign`;',
		);

		this.addSql(
			'alter table `artists_for_songs` drop foreign key `artists_for_songs_song_id_foreign`;',
		);

		this.addSql(
			'alter table `songs_in_albums` drop foreign key `songs_in_albums_song_id_foreign`;',
		);

		this.addSql(
			'alter table `song_names` drop foreign key `song_names_song_id_foreign`;',
		);

		this.addSql(
			'alter table `song_web_links` drop foreign key `song_web_links_song_id_foreign`;',
		);

		this.addSql(
			'alter table `song_tag_usages` drop foreign key `song_tag_usages_song_id_foreign`;',
		);

		this.addSql(
			'alter table `tags` drop foreign key `tags_parent_id_foreign`;',
		);

		this.addSql(
			'alter table `song_tag_usages` drop foreign key `song_tag_usages_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_tag_usages` drop foreign key `release_event_tag_usages_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `release_event_series_tag_usages` drop foreign key `release_event_series_tag_usages_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `related_tags` drop foreign key `related_tags_owner_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `related_tags` drop foreign key `related_tags_linked_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `artist_tag_usages` drop foreign key `artist_tag_usages_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `album_tag_usages` drop foreign key `album_tag_usages_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `tag_names` drop foreign key `tag_names_tag_id_foreign`;',
		);

		this.addSql(
			'alter table `tag_web_links` drop foreign key `tag_web_links_tag_id_foreign`;',
		);*/

		this.addSql('drop table if exists `artists`;');

		this.addSql('drop table if exists `artists_for_artists`;');

		this.addSql('drop table if exists `artist_names`;');

		this.addSql('drop table if exists `artist_picture_files`;');

		this.addSql('drop table if exists `artist_web_links`;');

		this.addSql('drop table if exists `release_event_series`;');

		this.addSql('drop table if exists `release_events`;');

		this.addSql('drop table if exists `release_event_names`;');

		this.addSql('drop table if exists `pvs_for_release_events`;');

		this.addSql('drop table if exists `artists_for_release_events`;');

		this.addSql('drop table if exists `albums`;');

		this.addSql('drop table if exists `pvs_for_albums`;');

		this.addSql('drop table if exists `artists_for_albums`;');

		this.addSql('drop table if exists `album_web_links`;');

		this.addSql('drop table if exists `album_picture_files`;');

		this.addSql('drop table if exists `album_names`;');

		this.addSql('drop table if exists `album_identifiers`;');

		this.addSql('drop table if exists `album_disc_properties`;');

		this.addSql('drop table if exists `release_event_series_names`;');

		this.addSql('drop table if exists `release_event_series_web_links`;');

		this.addSql('drop table if exists `release_event_web_links`;');

		this.addSql('drop table if exists `songs`;');

		this.addSql('drop table if exists `pvs_for_songs`;');

		this.addSql('drop table if exists `lyrics_for_songs`;');

		this.addSql('drop table if exists `artists_for_songs`;');

		this.addSql('drop table if exists `songs_in_albums`;');

		this.addSql('drop table if exists `song_names`;');

		this.addSql('drop table if exists `song_web_links`;');

		this.addSql('drop table if exists `tags`;');

		this.addSql('drop table if exists `song_tag_usages`;');

		this.addSql('drop table if exists `release_event_tag_usages`;');

		this.addSql('drop table if exists `release_event_series_tag_usages`;');

		this.addSql('drop table if exists `related_tags`;');

		this.addSql('drop table if exists `artist_tag_usages`;');

		this.addSql('drop table if exists `album_tag_usages`;');

		this.addSql('drop table if exists `tag_names`;');

		this.addSql('drop table if exists `tag_web_links`;');
	}
}
