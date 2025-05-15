import { prisma } from "../db";
import { UserRepository } from "./UserRepository";
import { PostRepository } from "./PostRepository";
import { PageRepository } from "./PageRepository";
import { CategoryRepository } from "./CategoryRepository";
import { TagRepository } from "./TagRepository";

// Create repository instances
export const userRepository = new UserRepository(prisma);
export const postRepository = new PostRepository(prisma);
export const pageRepository = new PageRepository(prisma);
export const categoryRepository = new CategoryRepository(prisma);
export const tagRepository = new TagRepository(prisma);

// Export repository classes
export { UserRepository } from "./UserRepository";
export { PostRepository } from "./PostRepository";
export { PageRepository } from "./PageRepository";
export { CategoryRepository } from "./CategoryRepository";
export { TagRepository } from "./TagRepository";
export { BaseRepository } from "./BaseRepository";
