import { NextRequest, NextResponse } from "next/server";
import { InvoiceSchema } from "@/lib/schema";
import { generateXRechnungXML } from "@/lib/zugferd-generator";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod (same schema as invoice endpoint)
    const invoice = InvoiceSchema.parse(body);
    
    // Generate XRechnung XML
    const xmlString = await generateXRechnungXML(invoice);
    
    // Return XML as response
    return new Response(xmlString, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="xrechnung-${invoice.invoiceNumber}.xml"`,
        "Content-Length": Buffer.byteLength(xmlString, "utf8").toString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.error("XRechnung generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "XRechnung API is running. Send POST request with invoice data to generate XRechnung XML.",
  });
}

