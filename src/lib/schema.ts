import { z } from "zod";

export const SellerSchema = z.object({
  name: z.string().min(1, "Seller name is required"),
  address: z.string().min(1, "Seller address is required"),
  taxNumber: z.string().optional(),
  vatId: z.string().optional(),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  address: z.string().min(1, "Customer address is required"),
  additionalInfo: z.array(z.string()).optional(),
});

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
});

export const BankDetailsSchema = z.object({
  iban: z.string().min(1, "IBAN is required"),
  bankName: z.string().min(1, "Bank name is required"),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  seller: SellerSchema,
  customer: CustomerSchema,
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  note: z.string().optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  bankDetails: BankDetailsSchema.optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Seller = z.infer<typeof SellerSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type BankDetails = z.infer<typeof BankDetailsSchema>;
