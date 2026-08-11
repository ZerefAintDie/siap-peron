'use client'

import { useState } from 'react'
import { IconArrowLeft, IconSearch, IconDownload, FieldGrid, SectionHeader } from '@/components/SharedUI'
import { QRKematian } from '@/components/QRWidgets'
import PrintModalKematian from '@/components/PrintModalKematian'

export default function KematianView({ onBack }: { onBack: () => void }) {
  const [nik, setNik] = useState('')
  const [namaJenazah, setNamaJenazah] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPrint, setShowPrint] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const canSearch = nik.trim().length > 0 && namaJenazah.trim().length > 0

  const handleSearch = async () => {
    if (!canSearch) return
    setLoading(true)
    setErrorMsg('')

    try {
      const query = `${nik.trim()} ${namaJenazah.trim()}`
      const res = await fetch(`/api/lookup-data?type=kematian&q=${encodeURIComponent(query)}`)
      const json = await res.json()

      if (json.success && json.data.length > 0) {
        setResult(json.data[0])
      } else {
        setResult(null)
      }
      setSearched(true)
    } catch (err) {
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
        body: JSON.stringify({ type: 'kematian', data: result }),
      })

      if (!res.ok) throw new Error('Gagal mendownload dokumen')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Surat_Kematian_${result['Nama Jenazah'] || 'Jenazah'}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      alert('Terjadi kesalahan saat mengunduh dokumen Word.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors min-h-[44px] px-2"
        >
          <IconArrowLeft /> Kembali
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Surat Kematian
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white">
            <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cari Data Kematian
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan NIK Jenazah <strong>dan</strong> Nama Jenazah untuk mencari data.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">NIK Jenazah</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => { setNik(e.target.value); setSearched(false) }}
                placeholder="Contoh NIK Jenazah..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nama Jenazah</label>
              <input
                type="text"
                value={namaJenazah}
                onChange={(e) => { setNamaJenazah(e.target.value); setSearched(false) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Contoh Nama Jenazah..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!canSearch || loading}
              className="w-full flex items-center justify-center gap-2 min-h-[48px] py-3 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-all disabled:opacity-40 shadow-sm"
            >
              {loading ? 'Mencari...' : <><IconSearch /> Cari Data</>}
            </button>
            {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
          </div>
        </div>

        {!searched && (
          <div className="bg-white rounded-2xl border border-violet-100 p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-32 h-32 shrink-0 border border-violet-100 rounded-xl p-1.5 shadow-sm">
              <QRKematian />
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Scan QR — Form Kematian
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                Ahli waris dapat mengisi data secara mandiri melalui smartphone.
              </p>
            </div>
          </div>
        )}

        {searched && !result && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <h3 className="font-bold text-slate-700 mb-1">Data Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500">Pastikan data kematian sudah diinput melalui Google Form.</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Data Ditemukan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Berhasil ditarik dari Google Sheets</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                Valid
              </span>
            </div>

            <SectionHeader label="Detail Informasi Kematian" color="bg-violet-50 text-violet-700" />
            <div className="p-6">
              <FieldGrid fields={Object.entries(result).map(([k, v]) => ({ label: k, value: String(v) }))} />
            </div>

            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadDocx}
                className="flex-1 flex items-center justify-center gap-2.5 min-h-[52px] py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <IconDownload />
                Unduh Dokumen (.docx)
              </button>
              <button
                onClick={() => setShowPrint(true)}
                className="flex items-center justify-center gap-2 min-h-[52px] py-3.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cetak / Print
              </button>
            </div>
          </div>
        )}
      </div>

      {showPrint && result && (
        <PrintModalKematian data={result} onClose={() => setShowPrint(false)} />
      )}
    </div>
  )
}