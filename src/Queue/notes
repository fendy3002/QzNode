CREATE TABLE `qz_queue`(
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `tag` varchar(32) NOT NULL DEFAULT 'default',
    `uuid` char(32) NOT NULL,
    `key` varchar(120) NULL,
    `utc_run` DATETIME NOT NULL,
    `run_script` varchar(255),
    `params` text,
    `priority` SMALLINT NOT NULL DEFAULT 3,
    `retry` SMALLINT NOT NULL DEFAULT 0,
    `utc_created` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    KEY `ix_tag` (`tag`, `utc_run`, `retry`),
    KEY `ix_key` (`key`),
    KEY `ix_uuid` (`uuid`)
);

CREATE TABLE `qz_queue_running`(
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `uuid` CHAR(32) NOT NULL,
    `queue_id` INT UNSIGNED NOT NULL,
    `queue_uuid` char(32) NOT NULL,
    `tag` varchar(32) NOT NULL DEFAULT 'default',
    `key` varchar(120) NULL,
    `utc_run` DATETIME NOT NULL,
    `run_script` varchar(255),
    `params` text,
    `priority` SMALLINT NOT NULL DEFAULT 3,
    `retry` SMALLINT NOT NULL DEFAULT 0,
    `queue_utc_created` DATETIME NOT NULL,
    `utc_created` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    KEY `ix_tag` (`uuid`, `tag`, `utc_run`, `retry`),
    KEY `ix_key` (`key`)
);