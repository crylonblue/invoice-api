import { NextRequest, NextResponse } from "next/server";
import { InvoiceSchema } from "@/lib/schema";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const invoice = InvoiceSchema.parse(body);
    
    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);
    
    // Return PDF as binary response
    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="rechnung-${invoice.invoiceNumber}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
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

    console.error("Invoice generation error:", error);
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
    message: "Invoice API is running. Send POST request with invoice data.",
  });
}
