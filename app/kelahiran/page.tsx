'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconArrowLeft, IconSearch, IconDownload, FieldGrid } from '@/components/SharedUI'

export default function KelahiranPage() {
  const router = useRouter()
  const [nik, setNik] = useState('')
  const [namaBayi, setNamaBayi] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [error, setError] = useState("")

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Hanya izinkan angka dan hapus karakter non-angka
    if (!/^\d*$/.test(value)) return;

    setNik(value);
    setSearched(false);

    if (value.length === 0) {
      setError("");
    } else if (value.length < 16) {
      setError("NIK harus terdiri dari 16 digit.");
    } else {
      setError("");
    }
  };

  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdKRhTxO0xLzgpw1554ujHdCKFI-NFDYPjHBY5rst6_EuAWGA/viewform?usp=sharing&ouid=100874742246390020662'
  // Perbaiki path menuju folder public/templates/
  const qrCodeUrl = '/templates/Form-Kelahiran-Desa-Peron.png'

  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    3: false,
  })

  const toggleSection = (secNum: 1 | 2 | 3) => {
    setOpenSections((prev) => ({ ...prev, [secNum]: !prev[secNum] }))
  }

  const canSearch = nik.trim().length > 0 && namaBayi.trim().length > 0

  const handleSearch = async () => {
    if (!canSearch) return
    setLoading(true)
    setErrorMsg('')

    try {
      const query = `${nik.trim()} ${namaBayi.trim()}`
      const res = await fetch(`/api/lookup-data?type=kelahiran&q=${encodeURIComponent(query)}`)
      const json = await res.json()

      if (json.success && json.data.length > 0) {
        setResult(json.data[0])
        setOpenSections({ 1: true, 2: false, 3: false })
      } else {
        setResult(null)
      }
      setSearched(true)
    } catch (err: any) {
      setErrorMsg('Gagal terhubung ke server/Google Sheets.')
      setResult(null)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocx = async () => {
    if (!result) return
    try {
      const res = await fetch('/api/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'kelahiran', data: result }),
      })

      if (!res.ok) throw new Error('Gagal mendownload dokumen')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Surat_Kelahiran_${result['Nama'] || 'Bayi'}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      alert('Terjadi kesalahan saat mengunduh dokumen Word.')
    }
  }

  const getFieldsByKeys = (keys: string[]) => {
    if (!result) return []
    return Object.entries(result)
      .filter(([k]) => keys.includes(k))
      .map(([k, v]) => ({ label: k, value: String(v) }))
  }

  const keysIdentitas = [
    'Timestamp', 'Nama Lengkap Kepala Keluarga', 'Nomor Kartu Keluarga (KK)',
    'Nama', 'Jenis Kelamin', 'Tempat Lahir', 'Hari dan Tanggal lahir',
    'Pukul', 'Jenis Kelahiran', 'Kelahiran Ke', 'Penolong kelahiran',
    'Berat bayi', 'Panjang bayi', 'Tempat Kelahiran'
  ]
  const keysOrangTua = [
    'NIK Ibu', 'Nama Lengkap Ibu', 'Tanggal Lahir Ibu', 'Pekerjaan Ibu', 'Alamat Ibu',
    'NIK Ayah', 'Nama Lengkap Ayah', 'Tanggal Lahir Ayah', 'Pekerjaan Ayah', 'Alamat Ayah'
  ]
  const keysPelaporSaksi = [
    'NIK Pelapor', 'Nama Lengkap Pelapor', 'Tanggal Lahir Pelapor', 'Pekerjaan Pelapor', 'Alamat Pelapor',
    'NIK Saksi 1', 'Nama Lengkap Saksi 1', 'Tanggal Lahir Saksi 1', 'Pekerjaan Saksi 1', 'Alamat Saksi 1',
    'NIK Saksi 2', 'Nama Lengkap Saksi 2', 'Tanggal Lahir Saksi 2', 'Pekerjaan Saksi 2', 'Alamat Saksi 2'
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors min-h-[44px] px-2"
        >
          <IconArrowLeft /> Kembali
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Surat Kelahiran
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* CARD PENCARIAN */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cari Data Kelahiran
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan Nomor KK <strong>dan</strong> Nama Bayi untuk mencocokkan data dari Google Form.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nomor KK</label>
              <input
                type="text"
                value={nik}
                onChange={handleNikChange}
                placeholder="Nomor KK..."
                maxLength={16}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 font-mono ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 focus:ring-blue-500"
                }`}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nama Bayi</label>
              <input
                type="text"
                value={namaBayi}
                onChange={(e) => { setNamaBayi(e.target.value); setSearched(false) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nama Lengkap Bayi..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!canSearch || loading}
              className="w-full flex items-center justify-center gap-2 min-h-[48px] py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 shadow-sm"
            >
              {loading ? 'Mencari ke Spreadsheet...' : <><IconSearch /> Cari Data</>}
            </button>
            {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
          </div>
        </div>

        {/* SECTION SCAN QR / ISI FORM MANDIRI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex-shrink-0 flex items-center justify-center w-32 h-32 relative">
            <Image 
              src={qrCodeUrl}
              alt="QR Code Form Kelahiran" 
              fill
              sizes="128px"
              className="object-contain p-2" 
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-slate-800 text-sm">Isi Data Kelahiran</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Warga dapat mengisi data kelahiran secara mandiri via smartphone. Data akan tersimpan otomatis ke sistem.
            </p>
            <div>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-lg border border-blue-100 transition-colors shadow-sm"
              >
                <span>Isi Form Kelahiran</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {searched && !result && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <h3 className="font-bold text-slate-700 mb-1">Data Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500">Pastikan Nomor KK dan Nama Bayi sudah diinput melalui Google Form.</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-bold text-slate-800">Data Ditemukan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Siap diunduh menjadi dokumen Word (.docx)</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                Valid
              </span>
            </div>

            {/* SECTION 1: IDENTITAS */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => toggleSection(1)}
                className="w-full px-6 py-3.5 bg-blue-50/80 text-blue-700 flex items-center justify-between font-bold text-xs uppercase tracking-wider transition-colors hover:bg-blue-100/60"
              >
                <span>1 · Identitas Bayi & Keluarga</span>
                <span className="transform transition-transform duration-200">
                  {openSections[1] ? '▲' : '▼'}
                </span>
              </button>
              {openSections[1] && (
                <div className="p-6 bg-white">
                  <FieldGrid fields={getFieldsByKeys(keysIdentitas)} />
                </div>
              )}
            </div>

            {/* SECTION 2: ORANG TUA */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => toggleSection(2)}
                className="w-full px-6 py-3.5 bg-blue-50/80 text-blue-700 flex items-center justify-between font-bold text-xs uppercase tracking-wider transition-colors hover:bg-blue-100/60"
              >
                <span>2 · Orang Tua</span>
                <span className="transform transition-transform duration-200">
                  {openSections[2] ? '▲' : '▼'}
                </span>
              </button>
              {openSections[2] && (
                <div className="p-6 bg-white">
                  <FieldGrid fields={getFieldsByKeys(keysOrangTua)} />
                </div>
              )}
            </div>

            {/* SECTION 3: PELAPOR & SAKSI */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => toggleSection(3)}
                className="w-full px-6 py-3.5 bg-blue-50/80 text-blue-700 flex items-center justify-between font-bold text-xs uppercase tracking-wider transition-colors hover:bg-blue-100/60"
              >
                <span>3 · Pelapor & Saksi</span>
                <span className="transform transition-transform duration-200">
                  {openSections[3] ? '▲' : '▼'}
                </span>
              </button>
              {openSections[3] && (
                <div className="p-6 bg-white">
                  <FieldGrid fields={getFieldsByKeys(keysPelaporSaksi)} />
                </div>
              )}
            </div>

            <div className="px-6 py-6 bg-slate-50">
              <button
                onClick={handleDownloadDocx}
                className="w-full flex items-center justify-center gap-2.5 min-h-[52px] py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <IconDownload />
                Unduh Dokumen Surat (.docx)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}