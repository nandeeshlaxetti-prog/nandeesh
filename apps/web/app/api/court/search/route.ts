import { NextRequest, NextResponse } from "next/server";
import { getCaseByCnr, searchAdvanced, normalizeToTable } from "@/lib/court-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.cnr) {
      const data = await getCaseByCnr(String(body.cnr));
      return NextResponse.json({ ok: true, data });
    }

    if (body.mode) {
      const raw = await searchAdvanced(body);
      const rows = normalizeToTable(raw);
      return NextResponse.json({ ok: true, count: rows.length, results: rows, raw });
    }

    return NextResponse.json({ ok: false, error: "Provide either { cnr } or advanced search { mode, ... }" }, { status: 400 });
  } catch (e: any) {
    const status = e?.response?.status || 500;
    const msg = e?.response?.data || e?.message || "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}