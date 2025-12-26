# Invoice API

Eine einfache Serverless-API zur PDF-Rechnungsgenerierung mit Next.js, bereit für Vercel.

## Features

- ✅ JSON → PDF Konvertierung
- ✅ Zod-Validierung
- ✅ **ZUGFeRD/Factur-X EN16931 Support** - Maschinenlesbare XML-Rechnungen
- ✅ **PDF/A-3b konform** - Archivierungsfähige Dokumente
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

## API Endpunkte

### POST /api/invoice

Generiert eine PDF-Rechnung mit eingebetteter ZUGFeRD-XML aus dem übergebenen JSON.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: Invoice JSON (siehe Schema unten)

**Response:**
- Content-Type: `application/pdf`
- Body: PDF Binary (mit eingebetteter ZUGFeRD-XML)

### POST /api/xrechnung

Generiert eine XRechnung/ZUGFeRD-XML-Datei aus dem übergebenen JSON (ohne PDF).

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: Invoice JSON (siehe Schema unten)

**Response:**
- Content-Type: `application/xml; charset=utf-8`
- Body: XRechnung XML (EN16931-konform)

**Verwendung:**
```bash
curl -X POST http://localhost:3000/api/xrechnung \
  -H "Content-Type: application/json" \
  -d @invoice.json \
  --output xrechnung.xml
```

### GET /api/invoice & GET /api/xrechnung

Health Check Endpunkte.

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
    "address": {
      "street": "Musterstraße",
      "streetNumber": "1",
      "postalCode": "80331",
      "city": "München"
    },
    "phoneNumber": "+49 89 12345678",
    "taxNumber": "123/456/78901",
    "vatId": "DE123456789"
  },

  "customer": {
    "name": "Inge Knaz",
    "address": {
      "street": "Hauptstraße",
      "streetNumber": "12",
      "postalCode": "20537",
      "city": "Hamburg"
    },
    "phoneNumber": "+49 40 87654321",
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

### Adress-Struktur

Die Adresse für Verkäufer und Kunde ist ein Objekt mit folgenden Pflichtfeldern:

| Feld | Beschreibung |
|------|--------------|
| `address.street` | Straßenname |
| `address.streetNumber` | Hausnummer |
| `address.postalCode` | Postleitzahl |
| `address.city` | Stadt |

### Optionale Felder

| Feld | Beschreibung |
|------|--------------|
| `note` | Notiz am Ende der Rechnung |
| `logoUrl` | URL zu einem Logo (PNG oder JPG). Wird oben links angezeigt. |
| `seller.subHeadline` | Unterzeile unter dem Verkäufernamen (nicht fett) |
| `seller.phoneNumber` | Telefonnummer des Verkäufers (wird im Footer angezeigt) |
| `seller.taxNumber` | Steuernummer |
| `seller.vatId` | USt-IdNr. |
| `customer.phoneNumber` | Telefonnummer des Kunden |
| `customer.additionalInfo` | Array mit zusätzlichen Kundeninformationen (z.B. Versicherungsnummer) |
| `bankDetails` | Bankverbindung (Objekt mit `iban` und `bankName`) |

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
      "address": {
        "street": "Musterstraße",
        "streetNumber": "1",
        "postalCode": "80331",
        "city": "München"
      },
      "phoneNumber": "+49 89 12345678",
      "taxNumber": "123/456/78901",
      "vatId": "DE123456789"
    },
    "customer": {
      "name": "Inge Knaz",
      "address": {
        "street": "Hauptstraße",
        "streetNumber": "12",
        "postalCode": "20537",
        "city": "Hamburg"
      },
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
    address: {
      street: "Musterstraße",
      streetNumber: "1",
      postalCode: "80331",
      city: "München"
    },
    phoneNumber: "+49 89 12345678",
    taxNumber: "123/456/78901",
    vatId: "DE123456789"
  },
  customer: {
    name: "Inge Knaz",
    address: {
      street: "Hauptstraße",
      streetNumber: "12",
      postalCode: "20537",
      city: "Hamburg"
    },
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
- [pdf-lib](https://pdf-lib.js.org/) (PDF-Generierung)
- [node-zugferd](https://www.npmjs.com/package/node-zugferd) (ZUGFeRD XML-Generierung & PDF/A-3b Konvertierung)
- [Vercel](https://vercel.com/) (Hosting)

## ZUGFeRD/XRechnung Support

Die API unterstützt die Generierung von **XRechnung/ZUGFeRD**-konformen Rechnungen im **EN16931-Profil** (EU-Standard):

### PDF mit eingebetteter XML (`/api/invoice`)
- **Maschinenlesbare XML-Daten** eingebettet als Attachment
- **PDF/A-3b Konvertierung** durch `node-zugferd` (reine JavaScript, Serverless-kompatibel)
- **XMP-Metadaten** für PDF/A-Identifikation
- **Eingebettete Schriftarten** für konsistente Darstellung

### Reine XML-Datei (`/api/xrechnung`)
- **XRechnung/ZUGFeRD XML** im EN16931-Format
- **Serverless-kompatibel** - keine externen Dependencies
- **Direkt verwendbar** für Rechnungsverarbeitungssysteme

Die generierten XML-Dateien können von Rechnungsverarbeitungssystemen automatisch verarbeitet werden und entsprechen den deutschen XRechnung-Anforderungen.

**Hinweis:** `node-zugferd` ist noch in der Beta-Phase. Es gibt bekannte Probleme mit XMP-Metadaten-Kodierung in einigen PDF-Validatoren. Die ZUGFeRD-XML-Daten sind jedoch korrekt generiert und können von Rechnungsverarbeitungssystemen gelesen werden.

## Lizenz

MIT
