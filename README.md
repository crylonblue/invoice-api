# Invoice API

Eine einfache Serverless-API zur PDF-Rechnungsgenerierung mit Next.js, bereit für Vercel.

## Features

- ✅ JSON → PDF Konvertierung
- ✅ Zod-Validierung
- ✅ Vercel Serverless kompatibel
- ✅ Keine Datenbank, keine Persistenz
- ✅ Perfekt für Automationen (n8n, Zapier, Make)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die API läuft dann unter `http://localhost:3000/api/invoice`

## Deployment auf Vercel

```bash
npm install -g vercel
vercel
```

Oder verbinde dein GitHub Repository direkt mit Vercel.

## API Endpunkt

### POST /api/invoice

Generiert eine PDF-Rechnung aus dem übergebenen JSON.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: Invoice JSON (siehe Schema unten)

**Response:**
- Content-Type: `application/pdf`
- Body: PDF Binary

### GET /api/invoice

Health Check Endpunkt.

## Input Schema

```json
{
  "invoiceNumber": "2025-INV-00123",
  "invoiceDate": "2025-12-06",
  "serviceDate": "2025-11-30",

  "seller": {
    "name": "Socy GmbH",
    "subHeadline": "Ihr Partner für Seniorenbetreuung",
    "address": "Musterstraße 1, 80331 München",
    "taxNumber": "123/456/78901",
    "vatId": "DE123456789"
  },

  "customer": {
    "name": "Inge Knaz",
    "address": "Hauptstraße 12, 20537 Hamburg",
    "additionalInfo": [
      "Versicherungsnummer: 1145123",
      "Kundennummer: K-2024-001"
    ]
  },

  "items": [
    {
      "description": "Seniorenassistenz – Leistungen am 23.11 und 23.12",
      "quantity": 24,
      "unit": "hours",
      "unitPrice": 47
    },
    {
      "description": "Fahrtkosten",
      "quantity": 5,
      "unit": "km",
      "unitPrice": 0.3
    }
  ],

  "taxRate": 19,
  "note": "Vielen Dank für Ihr Vertrauen.",
  "logoUrl": "https://example.com/logo.png",
  "bankDetails": {
    "iban": "DE89 3704 0044 0532 0130 00",
    "bankName": "Commerzbank AG"
  }
}
```

### Optionale Felder

| Feld | Beschreibung |
|------|--------------|
| `note` | Notiz am Ende der Rechnung |
| `logoUrl` | URL zu einem Logo (PNG oder JPG). Wird oben links angezeigt. |
| `seller.subHeadline` | Unterzeile unter dem Verkäufernamen (nicht fett) |
| `seller.taxNumber` | Steuernummer |
| `seller.vatId` | USt-IdNr. |
| `customer.additionalInfo` | Array mit zusätzlichen Kundeninformationen (z.B. Versicherungsnummer) |
| `bankDetails.iban` | IBAN für die Bankverbindung |
| `bankDetails.bankName` | Name der Bank |

## Beispiel-Requests

### cURL

```bash
curl -X POST http://localhost:3000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "2025-INV-00123",
    "invoiceDate": "2025-12-06",
    "serviceDate": "2025-11-30",
    "seller": {
      "name": "Socy GmbH",
      "subHeadline": "Ihr Partner für Seniorenbetreuung",
      "address": "Musterstraße 1, 80331 München",
      "taxNumber": "123/456/78901",
      "vatId": "DE123456789"
    },
    "customer": {
      "name": "Inge Knaz",
      "address": "Hauptstraße 12, 20537 Hamburg",
      "additionalInfo": [
        "Versicherungsnummer: 1145123",
        "Kundennummer: K-2024-001"
      ]
    },
    "items": [
      {
        "description": "Seniorenassistenz – Leistungen am 23.11 und 23.12",
        "quantity": 24,
        "unit": "hours",
        "unitPrice": 47
      },
      {
        "description": "Fahrtkosten",
        "quantity": 5,
        "unit": "km",
        "unitPrice": 0.3
      }
    ],
    "taxRate": 19,
    "note": "Vielen Dank für Ihr Vertrauen.",
    "logoUrl": "https://example.com/logo.png",
    "bankDetails": {
      "iban": "DE89 3704 0044 0532 0130 00",
      "bankName": "Commerzbank AG"
    }
  }' \
  --output rechnung.pdf
```

### JavaScript (fetch)

```javascript
const invoiceData = {
  invoiceNumber: "2025-INV-00123",
  invoiceDate: "2025-12-06",
  serviceDate: "2025-11-30",
  seller: {
    name: "Socy GmbH",
    subHeadline: "Ihr Partner für Seniorenbetreuung",
    address: "Musterstraße 1, 80331 München",
    taxNumber: "123/456/78901",
    vatId: "DE123456789"
  },
  customer: {
    name: "Inge Knaz",
    address: "Hauptstraße 12, 20537 Hamburg",
    additionalInfo: [
      "Versicherungsnummer: 1145123",
      "Kundennummer: K-2024-001"
    ]
  },
  items: [
    {
      description: "Seniorenassistenz – Leistungen am 23.11 und 23.12",
      quantity: 24,
      unit: "hours",
      unitPrice: 47
    },
    {
      description: "Fahrtkosten",
      quantity: 5,
      unit: "km",
      unitPrice: 0.3
    }
  ],
  taxRate: 19,
  note: "Vielen Dank für Ihr Vertrauen.",
  logoUrl: "https://example.com/logo.png",
  bankDetails: {
    iban: "DE89 3704 0044 0532 0130 00",
    bankName: "Commerzbank AG"
  }
};

const response = await fetch("https://your-app.vercel.app/api/invoice", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(invoiceData)
});

const pdfBlob = await response.blob();
// Download or process the PDF
```

### n8n HTTP Request Node

**URL:** `https://your-app.vercel.app/api/invoice`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`  
**Body:** JSON (Dein Invoice-Objekt)  
**Response Format:** `File`

### Zapier Webhooks

Verwende die **Webhooks by Zapier** Action mit:
- URL: `https://your-app.vercel.app/api/invoice`
- Method: POST
- Data Pass-Through: JSON Payload

## Validierungsfehler

Bei ungültigen Daten gibt die API einen 400-Fehler zurück:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "invoiceNumber",
      "message": "Invoice number is required"
    }
  ]
}
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Zod](https://zod.dev/) (Validierung)
- [PDFKit](https://pdfkit.org/) (PDF-Generierung)
- [Vercel](https://vercel.com/) (Hosting)

## Lizenz

MIT
