import { relations } from "drizzle-orm/relations";
import { users, files, folders, refreshTokens } from "./schema";

export const filesRelations = relations(files, ({one}) => ({
	user: one(users, {
		fields: [files.userId],
		references: [users.id]
	}),
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	files: many(files),
	folders: many(folders),
	refreshTokens: many(refreshTokens),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	files: many(files),
	user: one(users, {
		fields: [folders.userId],
		references: [users.id]
	}),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));