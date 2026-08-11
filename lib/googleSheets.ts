import { google } from 'googleapis';

export async function getGoogleSheetsClient(spreadsheetId: string) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Kredensial Google Sheets (GOOGLE_SERVICE_ACCOUNT_EMAIL atau GOOGLE_PRIVATE_KEY) belum diatur di .env.local');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  // Menggunakan nama sheet 'Form_Responses' sesuai dengan file Google Sheets kamu
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A:ZZ',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  const formattedData = dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = row[index] || '';
    });
    return obj;
  });

  console.log("Data berhasil ditarik dari Google Sheets:", formattedData.length, "baris.");
  return formattedData;
}