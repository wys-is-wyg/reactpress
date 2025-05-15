import { PrismaClient, Page, Prisma, Status } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Page-related database operations
 */
export class PageRepository extends BaseRepository<Page> {
  /**
   * Create a new PageRepository instance
   * @param prisma The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    super(prisma, "page");
  }

  /**
   * Find a page by slug
   * @param slug The page slug
   * @returns The found page or null
   */
  async findBySlug(slug: string): Promise<Page | null> {
    return this.prisma.page.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get published pages
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of published pages
   */
  async findPublished(skip?: number, take?: number): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: {
        status: Status.PUBLISHED,
      },
      orderBy: { title: "asc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Find pages by author ID
   * @param authorId The author's ID
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of pages by the author
   */
  async findByAuthor(
    authorId: string,
    skip?: number,
    take?: number
  ): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  /**
   * Create a page with the provided data
   * @param data The page data
   * @returns The created page
   */
  async createPage(data: Prisma.PageCreateInput): Promise<Page> {
    return this.prisma.page.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Update a page
   * @param id The page ID
   * @param data The data to update
   * @returns The updated page
   */
  async updatePage(id: string, data: Prisma.PageUpdateInput): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Publish a page
   * @param id The page ID
   * @returns The published page
   */
  async publishPage(id: string): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: {
        status: Status.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Unpublish (set to draft) a page
   * @param id The page ID
   * @returns The unpublished page
   */
  async unpublishPage(id: string): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: {
        status: Status.DRAFT,
        publishedAt: null,
      },
    });
  }
}
