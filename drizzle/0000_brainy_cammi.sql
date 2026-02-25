CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `completion` (
	`id` text PRIMARY KEY NOT NULL,
	`habitId` text NOT NULL,
	`userId` text NOT NULL,
	`completedDate` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`habitId`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `completions_habit_date_idx` ON `completion` (`habitId`,`completedDate`);--> statement-breakpoint
CREATE INDEX `completions_user_date_idx` ON `completion` (`userId`,`completedDate`);--> statement-breakpoint
CREATE TABLE `habit` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`emoji` text DEFAULT '✅' NOT NULL,
	`frequency` text DEFAULT 'daily' NOT NULL,
	`isArchived` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `habits_user_id_idx` ON `habit` (`userId`);--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`hashedPassword` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
