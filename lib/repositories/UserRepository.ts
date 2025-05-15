import { PrismaClient, User, Prisma, Role } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { hash, compare } from "bcrypt";

/**
 * Repository for User-related database operations
 */
export class UserRepository extends BaseRepository<User> {
  /**
   * Create a new UserRepository instance
   * @param prisma The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    super(prisma, "user");
  }

  /**
   * Find a user by email
   * @param email The email to search for
   * @returns The found user or null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user with hashed password
   * @param data User data including password
   * @returns The created user
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Hash the password
    const hashedPassword = await hash(data.password, 10);

    // Create the user with hashed password
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  /**
   * Update a user, hashing the password if provided
   * @param id User ID
   * @param data User data to update
   * @returns The updated user
   */
  async updateUser(
    id: string,
    data: Partial<Prisma.UserUpdateInput>
  ): Promise<User> {
    // If password is provided, hash it
    if (data.password && typeof data.password === "string") {
      data.password = await hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Verify a user's password
   * @param email User email
   * @param password Password to verify
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  /**
   * Get users with a specific role
   * @param role The role to filter by
   * @returns Array of users with the specified role
   */
  async findByRole(role: Role): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
    });
  }
}
