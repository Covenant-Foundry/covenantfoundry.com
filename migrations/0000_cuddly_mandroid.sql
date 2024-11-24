CREATE TABLE `Book` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`longDescription` text,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`link` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`imageId` text NOT NULL,
	FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Book_slug_unique` ON `Book` (`slug`);--> statement-breakpoint
CREATE INDEX `slugIndex` ON `Book` (`slug`);--> statement-breakpoint
CREATE TABLE `Community` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`link` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`imageId` text NOT NULL,
	FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Image` (
	`id` text PRIMARY KEY NOT NULL,
	`altText` text,
	`contentType` text NOT NULL,
	`blob` blob NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `Password` (
	`hash` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Password_userId_unique` ON `Password` (`userId`);--> statement-breakpoint
CREATE TABLE `Permission` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`access` text NOT NULL,
	`description` text DEFAULT '',
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissionUniqueIndex` ON `Permission` (`action`,`entity`,`access`);--> statement-breakpoint
CREATE TABLE `Role` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Role_name_unique` ON `Role` (`name`);--> statement-breakpoint
CREATE TABLE `RoleToPermission` (
	`roleId` text NOT NULL,
	`permissionId` text NOT NULL,
	PRIMARY KEY(`roleId`, `permissionId`),
	FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `RoleToUser` (
	`roleId` text NOT NULL,
	`userId` text NOT NULL,
	PRIMARY KEY(`roleId`, `userId`),
	FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`expirationDate` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `userIdIndex` ON `Session` (`userId`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`name` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);--> statement-breakpoint
CREATE TABLE `Verification` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`type` text NOT NULL,
	`target` text NOT NULL,
	`secret` text NOT NULL,
	`algorithm` text NOT NULL,
	`digits` integer NOT NULL,
	`period` integer NOT NULL,
	`charSet` text NOT NULL,
	`expiresAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verificationUniqueIndex` ON `Verification` (`target`,`type`);