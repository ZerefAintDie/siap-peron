'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MaintenancePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A314C] px-4 py-12 text-white">
      <div className="max-w-md w-full text-center">
        
        {/* Logo / Ilustrasi Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl mb-6 relative">
          <svg 
            className="w-10 h-10 text-amber-400 animate-pulse shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width="40"
            height="40"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>

        {/* Badge Status */}
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 mb-4">
          Pemeliharaan Sistem
        </span>

        {/* Judul */}
        <h1 
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Sedang Dalam Perbaikan
        </h1>

        {/* Deskripsi */}
        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8">
          Mohon maaf atas ketidaknyamanannya. Portal <strong className="text-white font-semibold">Pesat Peron</strong> sedang melakukan peningkatan sistem untuk memberikan layanan yang lebih baik. Silakan kembali beberapa saat lagi.
        </p>

        {/* Tombol Refresh / Coba Lagi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30"
          >
            Muat Ulang Halaman
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all border border-white/10"
          >
            Kembali ke Beranda
          </button>
        </div>


      </div>
    </div>
  )
}