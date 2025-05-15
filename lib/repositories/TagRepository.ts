import { PrismaClient, Tag, Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Tag-related database operations
 */
export class TagRepository extends BaseRepository<Tag> {
  /**
   * Create a new TagRepository instance
   * @param prisma The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    super(prisma, "tag");
  }

  /**
   * Find a tag by slug
   * @param slug The tag slug
   * @returns The found tag or null
   */
  async findBySlug(slug: string): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: { slug },
    });
  }

  /**
   * Get all tags with post count
   * @returns Array of tags with post count
   */
  async findAllWithPostCount(): Promise<(Tag & { postCount: number })[]> {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tags.map((tag) => ({
      ...tag,
      postCount: tag._count.posts,
    }));
  }

  /**
   * Add a post to a tag
   * @param tagId The tag ID
   * @param postId The post ID
   */
  async addPostToTag(tagId: string, postId: string): Promise<void> {
    await this.prisma.tagOnPost.create({
      data: {
        tagId,
        postId,
      },
    });
  }

  /**
   * Remove a post from a tag
   * @param tagId The tag ID
   * @param postId The post ID
   */
  async removePostFromTag(tagId: string, postId: string): Promise<void> {
    await this.prisma.tagOnPost.delete({
      where: {
        postId_tagId: {
          postId,
          tagId,
        },
      },
    });
  }

  /**
   * Get tags for a post
   * @param postId The post ID
   * @returns Array of tags for the post
   */
  async getTagsForPost(postId: string): Promise<Tag[]> {
    const tagPosts = await this.prisma.tagOnPost.findMany({
      where: { postId },
      include: {
        tag: true,
      },
    });

    return tagPosts.map((tp) => tp.tag);
  }
}
