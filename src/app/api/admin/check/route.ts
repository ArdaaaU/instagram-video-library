import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("instavault_session")?.value;

  if (!token) {
    return NextResponse.json({ isAdmin: false });
  }

  const isValid = verifySessionToken(token);
  return NextResponse.json({ isAdmin: isValid });
}
