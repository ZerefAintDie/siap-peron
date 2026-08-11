import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import expressionParser from 'docxtemplater/js/expressions';
import Docxtemplater from 'docxtemplater';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: 'Data dan tipe surat diperlukan' }, { status: 400 });
    }

    const templateFileName = type === 'kelahiran' ? 'template_kelahiran.docx' : 'template_kematian.docx';
    const templatePath = path.join(process.cwd(), 'public', 'templates', templateFileName);

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' },
      parser: expressionParser as any, // Type casting untuk menghindari error TypeScript
      nullGetter() {
        return '-';
      }
    });

    const rowIndex = Number(data['RowIndex']) || 1;
    const nomorUrut = String(rowIndex).padStart(3, '0');

    let renderData: Record<string, string> = {};

    if (type === 'kelahiran') {
      renderData = {
        nomor_surat: nomorUrut,
        tanggal_sekarang: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        nama_kepala_keluarga: data['Nama Lengkap Kepala Keluarga'] || '',
        nomor_kk: data['Nomor Kartu Keluarga (KK)'] || '',
        nama_bayi: data['Nama'] || '',
        jenis_kelamin: data['Jenis Kelamin'] || '',
        tempat_dilahirkan: data['Tempat Lahir'] || '',
        tempat_kelahiran: data['Tempat Kelahiran'] || '',
        tanggal_lahir: data['Hari dan Tanggal lahir'] || '',
        jam_lahir: data['Pukul'] || '',
        jenis_kelahiran: data['Jenis Kelahiran'] || '',
        anak_ke: data['Kelahiran Ke'] || '',
        penolong_kelahiran: data['Penolong kelahiran'] || '',
        berat_bayi: data['Berat bayi'] || '',
        panjang_bayi: data['Panjang bayi'] || '',
        nik_ibu: data['NIK Ibu'] || '',
        nama_ibu: data['Nama Lengkap Ibu'] || '',
        tanggal_lahir_ibu: data['Tanggal Lahir Ibu'] || '',
        pekerjaan_ibu: data['Pekerjaan Ibu'] || '',
        alamat_ibu: data['Alamat Ibu'] || '',
        nik_ayah: data['NIK Ayah'] || '',
        nama_ayah: data['Nama Lengkap Ayah'] || '',
        tanggal_lahir_ayah: data['Tanggal Lahir Ayah'] || '',
        pekerjaan_ayah: data['Pekerjaan Ayah'] || '',
        alamat_ayah: data['Alamat Ayah'] || '',
        nik_pelapor: data['NIK Pelapor'] || '',
        nama_pelapor: data['Nama Lengkap Pelapor'] || '',
        tanggal_lahir_pelapor: data['Tanggal Lahir Pelapor'] || '',
        pekerjaan_pelapor: data['Pekerjaan Pelapor'] || '',
        alamat_pelapor: data['Alamat Pelapor'] || '',
        nik_saksi_1: data['NIK Saksi 1'] || '',
        nama_saksi_1: data['Nama Lengkap Saksi 1'] || '',
        tanggal_lahir_saksi_1: data['Tanggal Lahir Saksi 1'] || '',
        pekerjaan_saksi_1: data['Pekerjaan Saksi 1'] || '',
        alamat_saksi_1: data['Alamat Saksi 1'] || '',
        nik_saksi_2: data['NIK Saksi 2'] || '',
        nama_saksi_2: data['Nama Lengkap Saksi 2'] || '',
        tanggal_lahir_saksi_2: data['Tanggal Lahir Saksi 2'] || '',
        pekerjaan_saksi_2: data['Pekerjaan Saksi 2'] || '',
        alamat_saksi_2: data['Alamat Saksi 2'] || '',
      };
    } else if (type === 'kematian') {
      renderData = {
        nomor_surat: nomorUrut,
        tanggal_sekarang: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        nama_kepala_keluarga: data['Nama Lengkap Kepala Keluarga'] || '',
        nomor_kk: data['Nomor Kartu Keluarga (KK)'] || '',
        nik_jenazah: data['NIK Jenazah'] || '',
        nama_jenazah: data['Nama Jenazah'] || '',
        jenis_kelamin: data['Jenis Kelamin'] || '',
        tanggal_lahir_jenazah: data['Tanggal Lahir Jenazah'] || '',
        tempat_kelahiran_jenazah: data['Tempat Kelahiran Jenazah'] || '',
        agama_jenazah: data['Agama'] || '',
        pekerjaan_jenazah: data['Pekerjaan Jenazah'] || '',
        alamat_jenazah: data['Alamat Jenazah'] || '',
        anak_ke: data['Anak ke-berapa'] || '',
        tanggal_kematian: data['Tanggal Kematian'] || '',
        jam_kematian: data['Jam Kematian'] || '',
        sebab_kematian: data['Sebab Kematian'] || '',
        tempat_kematian: data['Tempat Kematian'] || '',
        pemberi_keterangan: data['Pemberi Keterangan'] || '',
        nik_ibu: data['NIK Ibu'] || '',
        nama_ibu: data['Nama Lengkap Ibu'] || '',
        tanggal_lahir_ibu: data['Tanggal Lahir Ibu'] || '',
        pekerjaan_ibu: data['Pekerjaan Ibu'] || '',
        alamat_ibu: data['Alamat Ibu'] || '',
        nik_ayah: data['NIK Ayah'] || '',
        nama_ayah: data['Nama Lengkap Ayah'] || '',
        tanggal_lahir_ayah: data['Tanggal Lahir Ayah'] || '',
        pekerjaan_ayah: data['Pekerjaan Ayah'] || '',
        alamat_ayah: data['Alamat Ayah'] || '',
        nik_pelapor: data['NIK Pelapor'] || '',
        nama_pelapor: data['Nama Lengkap Pelapor'] || '',
        tanggal_lahir_pelapor: data['Tanggal Lahir Pelapor'] || '',
        pekerjaan_pelapor: data['Pekerjaan Pelapor'] || '',
        alamat_pelapor: data['Alamat Pelapor'] || '',
        nik_saksi_1: data['NIK Saksi 1'] || '',
        nama_saksi_1: data['Nama Lengkap Saksi 1'] || '',
        tanggal_lahir_saksi_1: data['Tanggal Lahir Saksi 1'] || '',
        pekerjaan_saksi_1: data['Pekerjaan Saksi 1'] || '',
        alamat_saksi_1: data['Alamat Saksi 1'] || '',
        nik_saksi_2: data['NIK Saksi 2'] || '',
        nama_saksi_2: data['Nama Lengkap Saksi 2'] || '',
        tanggal_lahir_saksi_2: data['Tanggal Lahir Saksi 2'] || '',
        pekerjaan_saksi_2: data['Pekerjaan Saksi 2'] || '',
        alamat_saksi_2: data['Alamat Saksi 2'] || '',
      };
    }

    doc.render(renderData);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Ubah Buffer ke Uint8Array agar kompatibel dengan NextResponse Next.js terbaru
    const uint8Array = new Uint8Array(buf);

    const fileName = type === 'kelahiran' 
      ? `Surat_Kelahiran_${renderData.nama_bayi || 'Draft'}.docx` 
      : `Surat_Kematian_${renderData.nama_jenazah || 'Draft'}.docx`;

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=${encodeURIComponent(fileName)}`,
      },
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}