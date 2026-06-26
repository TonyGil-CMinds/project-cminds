import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, lastname, email, gender, organization, country, data_agreement, policy_agreement } = body;

    if (!name || !lastname || !email) {
      return NextResponse.json({ error: "Name, last name and email are required." }, { status: 400 });
    }

    const contact = await prisma.contact.upsert({
      where: { email },
      update: { name, lastname, gender: gender || null, organization: organization || null, country: country || null, data_agreement: Boolean(data_agreement), policy_agreement: Boolean(policy_agreement) },
      create: { name, lastname, email, gender: gender || null, organization: organization || null, country: country || null, data_agreement: Boolean(data_agreement), policy_agreement: Boolean(policy_agreement) },
    });

    return NextResponse.json({ id: contact.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
