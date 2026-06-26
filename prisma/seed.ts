import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.post.upsert({
    where: { slug: "welcome-to-mindscope" },
    update: {},
    create: { slug: "welcome-to-mindscope", title: "Welcome to Mindscope" },
  });
  console.log("✅ Seeded database");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
