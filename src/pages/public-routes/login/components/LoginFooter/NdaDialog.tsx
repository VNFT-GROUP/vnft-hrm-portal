import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, BookLock } from "lucide-react";
import "./NdaDialog.css";

export default function NdaDialog() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger className="footer-link-text outline-none border-none bg-transparent m-0 p-0 hover:bg-transparent text-left relative group">
        <span className="relative z-10">{t('login.nda')}</span>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl! w-[95vw]! h-[90vh]! max-h-[1000px]! p-0 bg-linear-to-br from-slate-50/95 to-slate-100/95 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden flex flex-col nda-dialog-container" showCloseButton={true}>
        
        {/* Fancy Hero Header */}
        <div className="relative w-full shrink-0 px-8 pt-10 pb-8 bg-linear-to-r from-[#1E2062] to-[#2B2D85] overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" className="absolute -top-32 -left-32 w-96 h-96 animate-[spin_60s_linear_infinite]">
              <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98.1,-18.1,98.6,-2.4C99.1,13.3,93.4,29.3,84.1,43.2C74.8,57.1,61.9,68.9,47.2,77C32.5,85.1,16.2,89.5,0.7,88.4C-14.8,87.4,-29.7,80.9,-42.6,71.8C-55.5,62.7,-66.4,51.1,-75.4,37.5C-84.4,23.9,-91.5,8.4,-90.4,-6.1C-89.3,-20.6,-80,-34.1,-70,-45.8C-60,-57.5,-49.3,-67.4,-36.8,-75.4C-24.3,-83.4,-10,-89.5,2.6,-93.2C15.2,-96.9,30.5,-98.2,44.7,-76.4Z" transform="translate(200 200)" />
            </svg>
            <svg viewBox="0 0 200 200" className="absolute -bottom-20 -right-20 w-64 h-64 text-[#F7941D]">
              <path fill="currentColor" d="M45.7,-73.4C59.9,-66.2,72.8,-56.1,82.6,-43.3C92.4,-30.5,99.1,-15.1,99.6,0.6C100.1,16.3,94.4,32.3,85.1,46.2C75.8,60.1,62.9,71.9,48.2,80C33.5,88.1,17.2,92.5,1.7,91.4C-13.8,90.4,-28.7,83.9,-41.6,74.8C-54.5,65.7,-65.4,54.1,-74.4,40.5C-83.4,26.9,-90.5,11.4,-89.4,-3.1C-88.3,-17.6,-79,-31.1,-69,-42.8C-59,-54.5,-48.3,-64.4,-35.8,-72.4C-23.3,-80.4,-9,-86.5,3.6,-90.2C16.2,-93.9,31.5,-95.2,45.7,-73.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <DialogHeader className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flexitems-center justify-center mb-4 border border-white/20 shadow-lg flex items-center">
              <BookLock className="w-8 h-8 text-[#F7941D]" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold uppercase text-center tracking-tight text-white mb-2">
              {t('ndaContent.title')}
            </DialogTitle>
            <p className="text-center text-sm sm:text-base text-slate-300 font-medium max-w-lg">
              {t('ndaContent.subtitle')}
            </p>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
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

        {/* Bottom Fade Gradient for Scroll affordance */}
        <div className="h-6 w-full bg-linear-to-t from-slate-50/95 to-transparent absolute bottom-0 left-0 pointer-events-none rounded-b-3xl"></div>
      </DialogContent>
    </Dialog>
  );
}
