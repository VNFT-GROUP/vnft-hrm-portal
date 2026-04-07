import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "./LoginFooter.css";

export default function LoginFooter() {
  const { t } = useTranslation();
  return (
    <footer className="page-footer">
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} {t('login.allRightsReserved')}
      </div>
      <div className="footer-links">
        <Dialog>
          <DialogTrigger className="footer-link-text outline-none border-none bg-transparent m-0 p-0 hover:bg-transparent text-left">
            {t('login.nda')}
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase text-center block mb-1">
                {t('ndaContent.title')}
              </DialogTitle>
              <p className="text-center text-sm text-slate-500 font-medium mb-4">
                {t('ndaContent.subtitle')}
              </p>
            </DialogHeader>
            <div className="text-sm text-slate-700 leading-relaxed space-y-5 px-1 pb-4">
              <p className="text-justify">{t('ndaContent.intro')}</p>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-2">{t('ndaContent.section1.title')}</h3>
                <p className="mb-2">{t('ndaContent.section1.desc')}</p>
                <ul className="list-disc pl-5 space-y-1.5 text-justify">
                  {(t('ndaContent.section1.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">{t('ndaContent.section2.title')}</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-justify">
                  {(t('ndaContent.section2.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">{t('ndaContent.section3.title')}</h3>
                <p className="text-justify">{t('ndaContent.section3.content')}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">{t('ndaContent.section4.title')}</h3>
                <p className="text-justify">{t('ndaContent.section4.content')}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">{t('ndaContent.section5.title')}</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-justify">
                  {(t('ndaContent.section5.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
}
