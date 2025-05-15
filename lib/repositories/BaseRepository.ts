import { PrismaClient } from "@prisma/client";

/**
 * Base repository class that provides common functionality
 * for database operations. All model-specific repositories
 * will extend this class.
 */
export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;

  /**
   * Create a new repository instance
   * @param prisma The Prisma client instance
   * @param modelName The Prisma model name (e.g., 'user', 'post')
   */
  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  /**
   * Get the Prisma model dynamically
   * @returns The Prisma model
   */
  protected getModel(): any {
    return (this.prisma as any)[this.modelName];
  }

  /**
   * Find a record by its ID
   * @param id The record ID
   * @returns The found record or null
   */
  async findById(id: string): Promise<T | null> {
    return this.getModel().findUnique({
      where: { id },
    });
  }

  /**
   * Get all records with optional pagination
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Array of records
   */
  async findAll(skip?: number, take?: number): Promise<T[]> {
    return this.getModel().findMany({
      skip,
      take,
    });
  }

  /**
   * Create a new record
   * @param data The data to create
   * @returns The created record
   */
  async create(data: any): Promise<T> {
    return this.getModel().create({
      data,
    });
  }

  /**
   * Update a record
   * @param id The record ID
   * @param data The data to update
   * @returns The updated record
   */
  async update(id: string, data: any): Promise<T> {
    return this.getModel().update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a record
   * @param id The record ID
   * @returns The deleted record
   */
  async delete(id: string): Promise<T> {
    return this.getModel().delete({
      where: { id },
    });
  }

  /**
   * Count all records with optional filter
   * @param where Optional filter condition
   * @returns Number of records
   */
  async count(where?: any): Promise<number> {
    return this.getModel().count({
      where,
    });
  }
}
