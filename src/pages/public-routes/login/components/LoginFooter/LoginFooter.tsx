import { useTranslation } from "react-i18next";
import NdaDialog from "./NdaDialog";
import "./LoginFooter.css";

export default function LoginFooter() {
  const { t } = useTranslation();
  return (
    <footer className="page-footer">
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} {t('login.allRightsReserved')}
      </div>
      <div className="footer-links">
        <NdaDialog />
      </div>
    </footer>
  );
}
