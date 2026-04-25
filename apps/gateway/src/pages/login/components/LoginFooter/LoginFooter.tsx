import { useTranslation } from "react-i18next";
import NdaDialog from "@/components/custom/NdaDialog";

export default function LoginFooter() {
  const { t } = useTranslation();
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[64px] flex items-center justify-between px-6 md:px-12 z-50 bg-[#2E3192] border-t border-[#1E2062]">
      <span className="text-xs font-medium text-white/80">
        &copy; {new Date().getFullYear()} {t('login.allRightsReserved')}
      </span>
      <div className="flex items-center gap-3">
        <NdaDialog />
      </div>
    </footer>
  );
}
