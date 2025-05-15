const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.$transaction([
    prisma.tagOnPost.deleteMany(),
    prisma.categoryOnPost.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.post.deleteMany(),
    prisma.page.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("Creating admin user...");
  // Create admin user
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@reactpress.dev",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Creating categories...");
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "React",
        slug: "react",
        description: "Posts about React.js",
      },
    }),
    prisma.category.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        description: "Posts about Next.js framework",
      },
    }),
    prisma.category.create({
      data: {
        name: "Prisma",
        slug: "prisma",
        description: "Posts about Prisma ORM",
      },
    }),
  ]);

  console.log("Creating tags...");
  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Frontend",
        slug: "frontend",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Database",
        slug: "database",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Performance",
        slug: "performance",
      },
    }),
    prisma.tag.create({
      data: {
        name: "TypeScript",
        slug: "typescript",
      },
    }),
  ]);

  console.log("Creating sample content...");
  // Create a sample post
  const post = await prisma.post.create({
    data: {
      title: "Getting Started with ReactPress",
      slug: "getting-started-with-reactpress",
      content: `
# Welcome to ReactPress

This is a sample post to help you get started with ReactPress, a modern CMS built with React, Next.js, and Prisma.

## Features

- Modern React-based architecture
- Type-safe with TypeScript
- Powerful data layer with Prisma ORM
- Flexible content management
- SEO-friendly with Next.js

## Getting Started

To start using ReactPress, follow these steps:

1. Create your first post
2. Set up categories and tags
3. Customize your theme
4. Publish your content

Enjoy building with ReactPress!
      `,
      excerpt:
        "Learn how to get started with ReactPress, a modern CMS built with React and Next.js",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  // Connect post to categories and tags
  await Promise.all([
    prisma.categoryOnPost.create({
      data: {
        postId: post.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.categoryOnPost.create({
      data: {
        postId: post.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.tagOnPost.create({
      data: {
        postId: post.id,
        tagId: tags[0].id,
      },
    }),
    prisma.tagOnPost.create({
      data: {
        postId: post.id,
        tagId: tags[3].id,
      },
    }),
  ]);

  // Create a sample page
  await prisma.page.create({
    data: {
      title: "About ReactPress",
      slug: "about",
      content: `
# About ReactPress

ReactPress is a modern content management system built with React, Next.js, and Prisma.

## Our Mission

To provide a flexible, performant, and developer-friendly CMS for the modern web.

## Technologies

- React for UI components
- Next.js for server-side rendering and routing
- Prisma for database access
- TypeScript for type safety
- SQLite for simple data storage

Contact us at info@reactpress.dev for more information.
      `,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
