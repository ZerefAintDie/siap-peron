'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconBaby, IconDocument } from '@/components/SharedUI'

export default function HomeView() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9]">
      
      {/* BAGIAN ATAS (Background Biru Tua) */}
      <section className="relative w-full bg-[#1A314C] pt-6 pb-28 px-4 sm:px-8">
        
        {/* Top Navbar / Header */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-12">
          {/* Logo & Judul Kiri */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden bg-white/10 flex items-center justify-center shadow-md relative">
              <Image 
                src="/logo_kendal.png" 
                alt="Logo Pesat Peron" 
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Pesat Peron
              </h2>
              <p className="text-white/60 text-xs">Pengajuan Surat Desa Peron</p>
            </div>
          </div>

          {/* Badge Wilayah Kanan */}
          <div className="hidden sm:flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-xs bg-white/5 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Desa Peron, Kecamatan Sukorejo, Kabupaten Kendal
          </div>
        </div>

        {/* Hero Text */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            SELAMAT DATANG DI
          </p>
          <h1
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Pesat Peron
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 font-medium text-amber-400 text-sm sm:text-base tracking-wide">
            <span className='items-center justify-center tracking-wider'>PENGAJUAN SURAT DESA PERON</span>
          </div>
          <p className="text-white/70 text-xs sm:text-sm mt-3 max-w-lg mx-auto">
            Layanan pengajuan surat keterangan kelahiran dan kematian secara online, cepat dan mudah.
          </p>
        </div>
      </section>

      {/* BAGIAN UTAMA / KARTU LAYANAN */}
      <main className="flex-1 px-4 sm:px-8 -mt-16 relative z-10 pb-16 max-w-4xl mx-auto w-full">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Layanan Kami
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Kartu Surat Kelahiran */}
          <button
            onClick={() => router.push('/kelahiran')}
            className="group bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all text-left flex items-center justify-between border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
                <span className="[&>svg]:w-7 [&>svg]:h-7">
                  <IconBaby />
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Surat Kelahiran
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Cari, unduh, dan tambahkan data pada surat kelahiran
                </p>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-500 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors shrink-0 ml-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Kartu Surat Kematian */}
          <button
            onClick={() => router.push('/kematian')}
            className="group bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all text-left flex items-center justify-between border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30 shrink-0">
                <span className="[&>svg]:w-7 [&>svg]:h-7">
                  <IconDocument />
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Surat Kematian
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Cari, unduh, dan tambahkan data pada surat kematian
                </p>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-500 flex items-center justify-center text-amber-600 group-hover:text-white transition-colors shrink-0 ml-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

        </div>

        {/* Footer Info Box */}
        <div className="mt-8 bg-white border border-slate-200/80 rounded-xl py-3 px-5 text-center shadow-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs text-slate-600">
            Data pengajuan tersimpan secara aman melalui <strong className="text-slate-800 font-semibold">Google Sheets</strong> dan formulir terhubung dengan <strong className="text-slate-800 font-semibold">Google Forms</strong>.
          </p>
        </div>
        
        {/* All rights reserved */}
        {/* Logo unnes dan teks */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
          {/* Bungkus dengan div yang memiliki ukuran pasti (w-5 h-5 untuk 20px) */}
          <div className="relative w-5 h-5 shrink-0">
            <Image 
              src="/logo_unnes.png" 
              alt="Logo UNNES" 
              fill
              sizes="20px"
              className="object-contain"
            />
          </div>
          <span>© 2026 Universitas Negeri Semarang. All rights reserved.</span>
        </div>
      </main>
    </div>
  )
}