import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, lastname, email, gender, organization, country, data_agreement, policy_agreement } = body;

    if (!name || !lastname || !email) {
      return NextResponse.json({ error: "Name, last name and email are required." }, { status: 400 });
    }

    const existing = await prisma.contact.findUnique({ where: { email } });

    if (existing?.active) {
      return NextResponse.json({ code: "already_subscribed" }, { status: 409 });
    }

    const fields = {
      name,
      lastname,
      gender: gender || null,
      organization: organization || null,
      country: country || null,
      active: true,
      data_agreement: Boolean(data_agreement),
      policy_agreement: Boolean(policy_agreement),
    };

    const contact = existing
      ? await prisma.contact.update({ where: { email }, data: fields })
      : await prisma.contact.create({ data: { ...fields, email } });

    return NextResponse.json({ id: contact.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
