import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Compass,
  FlaskConical,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { EscrowChainLogo } from './EscrowChainLogo';

interface RoadmapViewProps {
  onBack: () => void;
  onOpenWhitepaper: () => void;
}

const milestones = [
  {
    phase: 'TAHAP SEKARANG',
    title: 'Prototipe & simulasi',
    period: 'Saat ini',
    status: 'Berjalan',
    description:
      'Menguji pengalaman rekening bersama untuk transaksi elektronik melalui demo lokal. Saldo, escrow, dan alur transaksi masih berupa simulasi—belum ada aset nyata yang dikelola.',
    outcomes: ['Alur pembeli dan penjual', 'Simulasi status pesanan', 'Dokumentasi arsitektur'],
    Icon: Compass,
    tone: 'emerald',
    current: true,
  },
  {
    phase: '01 · FONDASI',
    title: 'Validasi desain & kebutuhan',
    period: 'Perkiraan · 2027',
    status: 'Direncanakan',
    description:
      'Validasi kebutuhan UMKM dan pengguna, lalu tetapkan state machine, kebijakan biaya dan refund, serta model ancaman sebelum menyentuh aset nyata.',
    outcomes: ['Riset pengguna dan UMKM', 'Spesifikasi program escrow', 'Test case dan threat model'],
    Icon: Users,
    tone: 'teal',
  },
  {
    phase: '02 · PENGEMBANGAN',
    title: 'Implementasi & uji Devnet',
    period: 'Perkiraan · 2028',
    status: 'Bersyarat',
    description:
      'Jika rancangan dan sumber daya memadai, bangun integrasi wallet signing dan program escrow di Devnet. Uji jalur sukses, kegagalan, pemulihan, dan sengketa.',
    outcomes: ['Deposit dan penyelesaian', 'Timeout, refund, dan sengketa', 'Uji kondisi gagal'],
    Icon: Code2,
    tone: 'cyan',
  },
  {
    phase: '03 · KEAMANAN',
    title: 'Review independen & pilot terbatas',
    period: 'Perkiraan · 2029',
    status: 'Gerbang keamanan',
    description:
      'Setelah pengujian Devnet memadai, lakukan review independen. Pilot terbatas hanya dipertimbangkan setelah temuan kritis ditutup dan operasi serta respons insiden siap.',
    outcomes: ['Audit atau review independen', 'Pemantauan dan respons insiden', 'Pilot dengan batas risiko'],
    Icon: ShieldCheck,
    tone: 'indigo',
  },
  {
    phase: '04 · EVALUASI',
    title: 'Evaluasi peluncuran & tata kelola',
    period: '2030+ · Belum diputuskan',
    status: 'Keputusan terbuka',
    description:
      'Mainnet hanya dapat dipertimbangkan setelah keamanan, kepatuhan, kesiapan operasi, dan ekonomi protokol tervalidasi serta ada persetujuan eksplisit.',
    outcomes: ['Keputusan mainnet', 'Evaluasi tata kelola', 'Evaluasi integrasi lanjutan'],
    Icon: Rocket,
    tone: 'amber',
  },
];

const toneStyles: Record<string, { icon: string; badge: string; dot: string }> = {
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    dot: 'bg-emerald-400 ring-emerald-400/15',
  },
  teal: {
    icon: 'bg-teal-500/10 text-teal-300 border-teal-500/25',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-teal-400 ring-teal-400/15',
  },
  cyan: {
    icon: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-cyan-400 ring-cyan-400/15',
  },
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    dot: 'bg-indigo-400 ring-indigo-400/15',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    badge: 'bg-amber-500/10 text-amber-200 border-amber-500/25',
    dot: 'bg-amber-400 ring-amber-400/15',
  },
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onBack, onOpenWhitepaper }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-2.5 text-left" aria-label="Kembali ke beranda">
          <EscrowChainLogo size={32} />
          <span className="text-sm font-bold tracking-tight text-white sm:text-base">EscrowChain</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 sm:inline">Visi pengembangan</span>
          <button
            onClick={onOpenWhitepaper}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-white"
          >
            Baca Whitepaper <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-300">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke beranda
      </button>

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Roadmap EscrowChain
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Dari prototipe menuju <span className="text-emerald-400">escrow yang tepercaya.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Peta jalan bertahap untuk membangun rekening bersama yang aman bagi transaksi UMKM—mulai dari validasi kebutuhan, pengujian, hingga evaluasi peluncuran.
          </p>
        </div>
        <div className="relative mt-8 grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Status hari ini</div>
            <div className="mt-1 text-sm font-bold text-emerald-300">Prototipe lokal</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Fokus awal</div>
            <div className="mt-1 text-sm font-bold text-white">Transaksi elektronik UMKM</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Prinsip</div>
            <div className="mt-1 text-sm font-bold text-white">Keamanan sebelum ekspansi</div>
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16" aria-labelledby="milestones-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">Tahapan utama</p>
            <h2 id="milestones-heading" className="mt-2 text-2xl font-bold text-white sm:text-3xl">Satu langkah pada satu waktu</h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-slate-500">
            Tiap tahap bergantung pada hasil tahap sebelumnya, kesiapan tim, sumber daya, dan evaluasi risiko.
          </p>
        </div>

        <div className="relative">
          <div className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-emerald-400/70 via-slate-700 to-slate-800 sm:left-[27px]" />
          <div className="space-y-5">
            {milestones.map(({ phase, title, period, status, description, outcomes, Icon, tone, current }, index) => {
              const style = toneStyles[tone];
              return (
                <article key={phase} className="relative grid grid-cols-[40px_1fr] gap-3 sm:grid-cols-[56px_1fr] sm:gap-5">
                  <div className={`relative z-10 mt-5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-950 ring-4 sm:mt-6 sm:h-14 sm:w-14 ${style.dot}`}>
                    {current ? <Check className="h-4 w-4 text-slate-950 sm:h-5 sm:w-5" /> : <span className="font-mono text-xs font-bold text-slate-950">{String(index).padStart(2, '0')}</span>}
                  </div>
                  <div className={`rounded-2xl border bg-slate-900/70 p-5 transition-colors sm:p-7 ${current ? 'border-emerald-500/30 shadow-lg shadow-emerald-950/15' : 'border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{phase}</div>
                          <h3 className="mt-1 text-base font-bold text-white sm:text-lg">{title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pl-[52px] sm:pl-0">
                        <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] text-slate-300">{period}</span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style.badge}`}>{status}</span>
                      </div>
                    </div>
                    <p className="mt-4 max-w-3xl text-xs leading-6 text-slate-400 sm:text-sm">{description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {outcomes.map((outcome) => (
                        <span key={outcome} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-[10px] text-slate-300 sm:text-xs">
                          <Check className={`h-3 w-3 ${current ? 'text-emerald-400' : 'text-slate-600'}`} />
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="mt-10 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-950/20 p-5 sm:ml-[76px]">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div>
          <h2 className="text-sm font-bold text-amber-200">Roadmap ini bukan janji peluncuran</h2>
          <p className="mt-1 text-xs leading-6 text-amber-100/70">
            Jadwal 2027 dan seterusnya merupakan perkiraan perencanaan, dapat berubah atau dihentikan. Audit, mainnet, token AMN, DAO, DeFi, dan integrasi kurir belum aktif maupun dijamin terlaksana.
          </p>
        </div>
      </aside>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:ml-[76px]">
        <p className="text-xs text-slate-500">Pelajari asumsi, risiko, dan batasan teknis dalam whitepaper.</p>
        <button onClick={onOpenWhitepaper} className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 transition-colors hover:text-emerald-200">
          Buka whitepaper <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </main>
  </div>
);
