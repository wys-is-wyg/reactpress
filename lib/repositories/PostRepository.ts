import { PrismaClient, Post, Prisma, Status } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Post-related database operations
 */
export class PostRepository extends BaseRepository<Post> {
  /**
   * Create a new PostRepository instance
   * @param prisma The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    super(prisma, "post");
  }

  /**
   * Find a post by slug
   * @param slug The post slug
   * @returns The found post or null
   */
  async findBySlug(slug: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { slug },
    });
  }

  /**
   * Get published posts with pagination
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of published posts
   */
  async findPublished(skip?: number, take?: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        status: Status.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find posts by author ID
   * @param authorId The author's ID
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of posts by the author
   */
  async findByAuthor(
    authorId: string,
    skip?: number,
    take?: number
  ): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find posts by category slug
   * @param categorySlug The category slug
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of posts in the category
   */
  async findByCategory(
    categorySlug: string,
    skip?: number,
    take?: number
  ): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
        status: Status.PUBLISHED,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find posts by tag slug
   * @param tagSlug The tag slug
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of posts with the tag
   */
  async findByTag(
    tagSlug: string,
    skip?: number,
    take?: number
  ): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug: tagSlug,
            },
          },
        },
        status: Status.PUBLISHED,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Search posts by title or content
   * @param query The search query
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of matching posts
   */
  async searchPosts(
    query: string,
    skip?: number,
    take?: number
  ): Promise<Post[]> {
    const searchTerm = query.trim();

    return this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } },
          { excerpt: { contains: searchTerm } },
        ],
        status: Status.PUBLISHED,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }
}
