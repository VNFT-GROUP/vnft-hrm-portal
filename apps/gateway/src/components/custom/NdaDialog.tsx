import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, BookLock, X } from "lucide-react";

export default function NdaDialog() {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="text-xs font-semibold text-white/80 underline underline-offset-4 decoration-white/30 hover:text-[#F7941D] hover:decoration-[#F7941D] transition-all duration-200 outline-none border-none bg-transparent m-0 p-0 text-left relative group cursor-pointer"
        onClick={open}
      >
        <span className="relative z-10">{t('login.nda')}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="w-[95vw] max-w-7xl h-[90vh] max-h-[1000px] p-0 bg-linear-to-br from-slate-50/95 to-slate-100/95 backdrop-blur-3xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden m-auto backdrop:bg-black/50 backdrop:backdrop-blur-sm open:flex open:flex-col"
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      >
        {/* Close button */}
        <button type="button" className="absolute top-5 right-5 z-50 w-9 h-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/20 hover:rotate-90" onClick={close}>
          <X size={20} />
        </button>

        {/* Fancy Hero Header */}
        <div className="relative w-full shrink-0 px-8 pt-10 pb-8 overflow-hidden" style={{ background: 'linear-gradient(to right, #1E2062, #2B2D85)' }}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" className="absolute -top-32 -left-32 w-96 h-96" style={{ animation: 'spin 60s linear infinite' }}>
              <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98.1,-18.1,98.6,-2.4C99.1,13.3,93.4,29.3,84.1,43.2C74.8,57.1,61.9,68.9,47.2,77C32.5,85.1,16.2,89.5,0.7,88.4C-14.8,87.4,-29.7,80.9,-42.6,71.8C-55.5,62.7,-66.4,51.1,-75.4,37.5C-84.4,23.9,-91.5,8.4,-90.4,-6.1C-89.3,-20.6,-80,-34.1,-70,-45.8C-60,-57.5,-49.3,-67.4,-36.8,-75.4C-24.3,-83.4,-10,-89.5,2.6,-93.2C15.2,-96.9,30.5,-98.2,44.7,-76.4Z" transform="translate(200 200)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-lg" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
              <BookLock className="w-8 h-8 text-[#F7941D]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-center tracking-tight text-white mb-2">
              {t('ndaContent.title')}
            </h2>
            <p className="text-center text-sm sm:text-base text-slate-300 font-medium max-w-lg">
              {t('ndaContent.subtitle')}
            </p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-2.5 [&::-webkit-scrollbar-thumb]:bg-[#1E2062]/15 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#1E2062]/30">
          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-6 w-full pb-4">
            
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 p-3 right-0 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={100} />
              </div>
              <p className="text-justify font-medium text-slate-700 relative z-10 italic">
                {t('ndaContent.intro')}
              </p>
            </div>
            
            <div className="nda-section">
              <h3 className="flex items-center text-lg font-bold text-[#1E2062] mb-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-[#F7941D] flex items-center justify-center mr-3 text-sm">1</span>
                {t('ndaContent.section1.title').replace(/^1\.\s*/, '')}
              </h3>
              <p className="mb-3 text-slate-700 font-medium">{t('ndaContent.section1.desc')}</p>
              <ul className="space-y-3">
                {(t('ndaContent.section1.items', { returnObjects: true }) as string[]).map((item) => (
                  <li key={item.substring(0, 30)} className="flex gap-3 text-justify">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F7941D] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nda-section">
              <h3 className="flex items-center text-lg font-bold text-[#1E2062] mb-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-[#F7941D] flex items-center justify-center mr-3 text-sm">2</span>
                {t('ndaContent.section2.title').replace(/^2\.\s*/, '')}
              </h3>
              <ul className="space-y-3">
                {(t('ndaContent.section2.items', { returnObjects: true }) as string[]).map((item) => (
                  <li key={item.substring(0, 30)} className="flex gap-3 text-justify">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1E2062] opacity-70 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="nda-section p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                <h3 className="flex items-center text-lg font-bold text-[#1E2062] mb-3">
                  <span className="w-8 h-8 rounded-full bg-white text-[#F7941D] flex items-center justify-center mr-3 text-sm shadow-sm">3</span>
                  {t('ndaContent.section3.title').replace(/^3\.\s*/, '')}
                </h3>
                <p className="text-justify">{t('ndaContent.section3.content')}</p>
              </div>

              <div className="nda-section p-6 bg-red-50/30 rounded-2xl border border-red-50/50">
                <h3 className="flex items-center text-lg font-bold text-red-600 mb-3">
                  <span className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center mr-3 text-sm shadow-sm">4</span>
                  {t('ndaContent.section4.title').replace(/^4\.\s*/, '')}
                </h3>
                <p className="text-justify">{t('ndaContent.section4.content')}</p>
              </div>
            </div>

            <div className="nda-section p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
              <h3 className="flex items-center text-lg font-bold text-[#1E2062] mb-4">
                <span className="w-8 h-8 rounded-full bg-white text-[#F7941D] flex items-center justify-center mr-3 text-sm shadow-sm">5</span>
                {t('ndaContent.section5.title').replace(/^5\.\s*/, '')}
              </h3>
              <ul className="space-y-3">
                {(t('ndaContent.section5.items', { returnObjects: true }) as string[]).map((item) => (
                  <li key={item.substring(0, 30)} className="flex gap-3 text-justify">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F7941D] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </dialog>
    </>
  );
}
