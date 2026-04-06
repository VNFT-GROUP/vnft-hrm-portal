import "./LoginFooter.css";

export default function LoginFooter() {
  return (
    <footer className="page-footer">
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} VNFT Group. All rights reserved.
      </div>
      <div className="footer-links">
        <a href="#">Chính sách bảo mật</a>
        <span className="footer-divider">•</span>
        <a href="#">Điều khoản sử dụng</a>
      </div>
    </footer>
  );
}
