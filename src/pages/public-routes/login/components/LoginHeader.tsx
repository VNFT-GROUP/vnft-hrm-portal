import "./LoginHeader.css";

export default function LoginHeader() {
  return (
    <header className="page-header">
      <div className="header-brand-container">
        <img
          src="/logo/Logo-VNFT-1024x1024.webp"
          alt="VNFT Group"
          className="header-mini-logo"
        />
        <span className="header-brand-name">VNFT GROUP</span>
      </div>
    </header>
  );
}
