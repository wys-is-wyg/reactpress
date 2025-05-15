import { PrismaClient, Category, Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Category-related database operations
 */
export class CategoryRepository extends BaseRepository<Category> {
  /**
   * Create a new CategoryRepository instance
   * @param prisma The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    super(prisma, "category");
  }

  /**
   * Find a category by slug
   * @param slug The category slug
   * @returns The found category or null
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  /**
   * Get all categories with post count
   * @returns Array of categories with post count
   */
  async findAllWithPostCount(): Promise<(Category & { postCount: number })[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      postCount: category._count.posts,
    }));
  }

  /**
   * Add a post to a category
   * @param categoryId The category ID
   * @param postId The post ID
   */
  async addPostToCategory(categoryId: string, postId: string): Promise<void> {
    await this.prisma.categoryOnPost.create({
      data: {
        categoryId,
        postId,
      },
    });
  }

  /**
   * Remove a post from a category
   * @param categoryId The category ID
   * @param postId The post ID
   */
  async removePostFromCategory(
    categoryId: string,
    postId: string
  ): Promise<void> {
    await this.prisma.categoryOnPost.delete({
      where: {
        postId_categoryId: {
          postId,
          categoryId,
        },
      },
    });
  }

  /**
   * Get categories for a post
   * @param postId The post ID
   * @returns Array of categories for the post
   */
  async getCategoriesForPost(postId: string): Promise<Category[]> {
    const categoryPosts = await this.prisma.categoryOnPost.findMany({
      where: { postId },
      include: {
        category: true,
      },
    });

    return categoryPosts.map((cp) => cp.category);
  }
}
