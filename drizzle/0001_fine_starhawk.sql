CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classes_id` PRIMARY KEY(`id`),
	CONSTRAINT `classes_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `parent_account_learners` (
	`parentAccountId` int NOT NULL,
	`learnerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parent_account_learners_parentAccountId_learnerId_pk` PRIMARY KEY(`parentAccountId`,`learnerId`)
);
--> statement-breakpoint
ALTER TABLE `learners` ADD `classId` int;--> statement-breakpoint
ALTER TABLE `parent_account_learners` ADD CONSTRAINT `parent_account_learners_parentAccountId_parent_accounts_id_fk` FOREIGN KEY (`parentAccountId`) REFERENCES `parent_accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_account_learners` ADD CONSTRAINT `parent_account_learners_learnerId_learners_id_fk` FOREIGN KEY (`learnerId`) REFERENCES `learners`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learners` ADD CONSTRAINT `learners_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE set null ON UPDATE no action;