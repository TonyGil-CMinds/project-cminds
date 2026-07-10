import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { getClientIp, writeLimiter } from "../../../lib/ratelimit";

const subscribeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  lastname: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  gender: z.string().trim().max(200).optional(),
  organization: z.string().trim().max(200).optional(),
  country: z.string().trim().max(200).optional(),
  data_agreement: z.coerce.boolean().optional(),
  policy_agreement: z.coerce.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { success } = await writeLimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[subscribe] invalid input", parsed.error);
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const { name, lastname, gender, organization, country, data_agreement, policy_agreement } = parsed.data;
    const email = parsed.data.email.trim().toLowerCase();

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
