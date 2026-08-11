'use client'

import { useEffect } from 'react'

export default function PrintModalKematian({ data, onClose }: { data: any; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-area { display: block !important; position: fixed; inset: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all"
        >
          Cetak / Print
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 transition-all"
        >
          ✕ Tutup
        </button>
      </div>

      <div className="print-area bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden mt-14 p-10" style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="border-b-4 border-slate-800 pb-4 mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Pemerintah Kabupaten Kendal</p>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-800">Kecamatan Sukorejo</p>
          <h1 className="text-2xl font-extrabold uppercase text-slate-900 my-1">Pemerintah Desa Peron</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-bold uppercase underline tracking-widest text-slate-900">
            Surat Keterangan Kematian
          </h2>
        </div>

        <div className="space-y-2 text-sm text-slate-800">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="grid grid-cols-3">
              <span className="font-medium text-slate-600">{k}</span>
              <span className="col-span-2 font-semibold">: {String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}