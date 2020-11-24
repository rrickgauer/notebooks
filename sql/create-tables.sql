CREATE TABLE `Checklist_Items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `checklist_id` int(10) unsigned NOT NULL,
  `content` char(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `completed` enum('n','y') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n',
  `date_created` datetime NOT NULL,
  `date_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `checklist_id` (`checklist_id`),
  CONSTRAINT `Checklist_Items_ibfk_1` FOREIGN KEY (`checklist_id`) REFERENCES `Checklists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `Checklists` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `notebook_id` int(10) unsigned NOT NULL,
  `name` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `hidden` enum('n','y') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n',
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `notebook_id` (`notebook_id`),
  CONSTRAINT `Checklists_ibfk_1` FOREIGN KEY (`notebook_id`) REFERENCES `Notebooks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `Notebooks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `name` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Notebooks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `Notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `notebook_id` int(10) unsigned NOT NULL,
  `name` char(150) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci,
  `hidden` enum('n','y') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n',
  `date_created` datetime NOT NULL,
  `date_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `notebook_id` (`notebook_id`),
  CONSTRAINT `Notes_ibfk_1` FOREIGN KEY (`notebook_id`) REFERENCES `Notebooks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `Users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name_first` char(50) COLLATE utf8_unicode_ci NOT NULL,
  `name_last` char(75) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
