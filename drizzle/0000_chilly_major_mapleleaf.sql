CREATE TABLE IF NOT EXISTS `parent_accounts` (
		`id` int AUTO_INCREMENT NOT NULL,
		`username` varchar(80) NOT NULL,
		`accessCodeHash` varchar(128) NOT NULL,
		`parentName` varchar(160) NOT NULL,
		`parentEmail` varchar(320),
		`active` int NOT NULL DEFAULT 1,
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT `parent_accounts_id` PRIMARY KEY(`id`),
		CONSTRAINT `parent_accounts_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `learners` (
		`id` int AUTO_INCREMENT NOT NULL,
		`fullName` varchar(160) NOT NULL,
		`surname` varchar(120) NOT NULL,
		`className` varchar(80) NOT NULL,
		`parentAccountId` int,
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT `learners_id` PRIMARY KEY(`id`),
		CONSTRAINT `learners_parentAccountId_parent_accounts_id_fk` FOREIGN KEY (`parentAccountId`) REFERENCES `parent_accounts`(`id`) ON DELETE set null ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `performance_entries` (
		`id` int AUTO_INCREMENT NOT NULL,
		`learnerId` int NOT NULL,
		`activityName` varchar(160) NOT NULL,
		`activityType` varchar(60) NOT NULL,
		`marks` int NOT NULL,
		`totalMarks` int NOT NULL,
		`performedAt` timestamp NOT NULL DEFAULT (now()),
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		CONSTRAINT `performance_entries_id` PRIMARY KEY(`id`),
		CONSTRAINT `performance_entries_learnerId_learners_id_fk` FOREIGN KEY (`learnerId`) REFERENCES `learners`(`id`) ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `site_content` (
		`id` int AUTO_INCREMENT NOT NULL,
		`contentKey` varchar(100) NOT NULL,
		`title` varchar(180) NOT NULL,
		`body` text NOT NULL,
		`imageUrl` text,
		`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
		CONSTRAINT `site_content_contentKey_unique` UNIQUE(`contentKey`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `urgent_updates` (
		`id` int AUTO_INCREMENT NOT NULL,
		`title` varchar(180) NOT NULL,
		`body` text NOT NULL,
		`isPublished` int NOT NULL DEFAULT 0,
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		`expiresAt` timestamp,
		CONSTRAINT `urgent_updates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `documents` (
		`id` int AUTO_INCREMENT NOT NULL,
		`filename` varchar(255) NOT NULL,
		`storageKey` text NOT NULL,
		`storageUrl` text NOT NULL,
		`mimeType` varchar(120) NOT NULL,
		`uploadedBy` varchar(320) NOT NULL,
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
		`id` int AUTO_INCREMENT NOT NULL,
		`openId` varchar(64) NOT NULL,
		`name` text,
		`email` varchar(320),
		`loginMethod` varchar(64),
		`role` enum('user','admin') NOT NULL DEFAULT 'user',
		`createdAt` timestamp NOT NULL DEFAULT (now()),
		`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
		`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
		CONSTRAINT `users_id` PRIMARY KEY(`id`),
		CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
