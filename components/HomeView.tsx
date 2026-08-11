'use client'

import { IconBaby, IconDocument } from '@/components/SharedUI'

interface HomeViewProps {
  onNavigate: (view: 'kelahiran' | 'kematian') => void
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #f5f3ff 100%)' }}>
      <header className="px-4 sm:px-8 py-5 flex items-center gap-3 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            SIAP Desa
          </p>
          <p className="text-xs text-slate-500">Sistem Informasi Administrasi Pelayanan Desa</p>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-10 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Pemerintah Desa Peron
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Layanan Surat Administrasi
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
            Cetak surat kelahiran dan kematian secara cepat. Terintegrasi langsung dengan database Google Sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('kelahiran')}
            className="group flex items-center gap-4 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-5 text-left transition-all min-h-[80px]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white">
              <IconBaby />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Surat Kelahiran</p>
              <p className="text-xs text-slate-500 mt-0.5">Cari &amp; unduh surat keterangan kelahiran</p>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => onNavigate('kematian')}
            className="group flex items-center gap-4 bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md rounded-2xl p-5 text-left transition-all min-h-[80px]"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 text-white">
              <IconDocument />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Surat Kematian</p>
              <p className="text-xs text-slate-500 mt-0.5">Cari &amp; unduh surat keterangan kematian</p>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Data bersumber dari Google Sheets · Desa Peron, Kec. Sukorejo, Kab. Kendal
        </p>
      </main>
    </div>
  )
}