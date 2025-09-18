// src/app/api/alerts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json(); // "ACK" | "RESOLVED" | "SILENCED"

  const updated = await prisma.alert.update({
    where: { id: Number(params.id) },
    data: { status },
  });

  return NextResponse.json(updated);
}
