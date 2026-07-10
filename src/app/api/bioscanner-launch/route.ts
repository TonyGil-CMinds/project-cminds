import { NextResponse } from "next/server";
import { Pool } from "pg";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { getClientIp, writeLimiter } from "../../../lib/ratelimit";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const MAX_SEATS = 30;

const bioscannerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  lastname: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(200),
  have_computer: z.coerce.boolean(),
  monitoring: z.coerce.boolean(),
});

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run timingSafeEqual against a dummy of matching length to avoid
    // short-circuiting on length, keeping the overall check roughly constant time.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  const expected = process.env.BIOSCANNER_API_KEY;

  if (!apiKey || !expected || !safeCompare(apiKey, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT id, name, lastname, email, organization, country, have_computer, monitoring, "createdAt"
       FROM "BioscannerLaunch"
       ORDER BY "createdAt" DESC`
    );
    return NextResponse.json({ total: rows.length, seats_left: MAX_SEATS - rows.length, records: rows });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = await writeLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bioscannerSchema.safeParse(body);

  if (!parsed.success) {
    console.error("[bioscanner-launch] invalid input", parsed.error);
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { name, lastname, organization, country, have_computer, monitoring } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  const client = await pool.connect();
  try {
    const { rows: [countRow] } = await client.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM "BioscannerLaunch"'
    );

    const { rows: [existing] } = await client.query<{ id: string }>(
      'SELECT id FROM "BioscannerLaunch" WHERE email = $1',
      [email]
    );

    if (existing) {
      return NextResponse.json({ error: "exists" }, { status: 200 });
    }

    if (parseInt(countRow.count) >= MAX_SEATS) {
      return NextResponse.json({ error: "full" }, { status: 409 });
    }

    await client.query(
      `INSERT INTO "BioscannerLaunch" (id, name, lastname, email, organization, country, have_computer, monitoring, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [crypto.randomUUID(), name, lastname, email, organization, country, have_computer, monitoring]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } finally {
    client.release();
  }
}
