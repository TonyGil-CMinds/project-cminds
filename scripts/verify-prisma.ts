import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [subs, posts] = await Promise.all([
    prisma.subscription.count(),
    prisma.post.count(),
  ]);
  console.log(`✅ Connected — ${subs} subscription(s), ${posts} post(s)`);
}

main()
  .catch((e) => { console.error("❌ Failed:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
