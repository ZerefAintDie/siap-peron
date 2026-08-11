import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/googleSheets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('q')?.toLowerCase().trim() || ''; 

  if (!type || !query) {
    return NextResponse.json({ error: 'Parameter type dan q wajib diisi' }, { status: 400 });
  }

  const spreadsheetId = 
    type === 'kelahiran' 
      ? process.env.SHEET_ID_KELAHIRAN 
      : process.env.SHEET_ID_KEMATIAN;

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Spreadsheet ID belum dikonfigurasi di env' }, { status: 500 });
  }

  try {
    const rawRecords = await getGoogleSheetsClient(spreadsheetId);

    // Tambahkan RowIndex asli pada setiap record (index 0 di array berarti baris ke-1 data, dst.)
    const records = rawRecords.map((record, index) => ({
      ...record,
      RowIndex: index + 1,
    }));

    // Pisahkan query berdasarkan spasi menjadi kata kunci pencarian terpisah
    const keywords = query.split(/\s+/).filter(Boolean);

    // Filter data: Pastikan baris data mengandung setidaknya kata kunci yang dicari
    const filteredResults = records.filter((record) => {
      // Gabungkan seluruh value dari kolom baris tersebut (kecuali RowIndex agar pencarian bersih)
      const { RowIndex, ...recordWithoutIndex } = record;
      const rowString = Object.values(recordWithoutIndex).join(' ').toLowerCase();

      // Cek apakah minimal keyword yang diketik user ada di dalam baris ini
      return keywords.some((kw) => rowString.includes(kw));
    });

    return NextResponse.json({ success: true, data: filteredResults }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}