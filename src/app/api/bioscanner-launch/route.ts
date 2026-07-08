import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const MAX_SEATS = 30;

export async function POST(req: Request) {
  const { name, lastname, email, organization, country, have_computer, monitoring } = await req.json();

  if (!name || !lastname || !email || !organization || !country || have_computer === undefined || monitoring === undefined) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { rows: [countRow] } = await client.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM "BioscannerLaunch"'
    );

    const { rows: [existing] } = await client.query<{ name: string }>(
      'SELECT name FROM "BioscannerLaunch" WHERE email = $1',
      [email]
    );

    if (existing) {
      return NextResponse.json({ error: "exists", name: existing.name }, { status: 200 });
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
