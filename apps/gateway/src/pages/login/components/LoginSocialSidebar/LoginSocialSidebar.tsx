const socialLinks = [
  {
    name: "Website",
    url: "https://vnftgroup.com/vi/trang-chu/",
    color: "#4A4FC7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://web.facebook.com/vnftg",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/vnftgroup",
    color: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@VNFTGROUP",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    ),
  },
];

export default function LoginSocialSidebar() {
  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-40 max-md:relative max-md:left-auto max-md:top-auto max-md:transform-none max-md:flex-row max-md:justify-center max-md:mt-4 max-md:pb-8">
      <div className="flex flex-col gap-4 max-md:flex-row max-md:gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-start w-11 h-11 bg-white/70 backdrop-blur-md border border-white/80 rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:w-[140px] max-md:hover:w-10 max-md:w-10 max-md:h-10 transition-all duration-300"
            style={{ backgroundColor: "var(--hover-bg, rgba(255,255,255,0.7))", borderColor: "var(--hover-border, rgba(255,255,255,0.8))" }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.setProperty("--hover-bg", link.color);
              target.style.setProperty("--hover-border", link.color);
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.setProperty("--hover-bg", "rgba(255,255,255,0.7)");
              target.style.setProperty("--hover-border", "rgba(255,255,255,0.8)");
            }}
          >
            <div className="w-11 h-11 flex items-center justify-center shrink-0 text-slate-500 group-hover:text-white transition-colors duration-300 max-md:w-10 max-md:h-10 [&>svg]:w-5 [&>svg]:h-5">
              {link.icon}
            </div>
            <span className="text-[0.85rem] font-bold text-white whitespace-nowrap opacity-0 -translate-x-2.5 transition-all duration-300 tracking-wider uppercase group-hover:opacity-100 group-hover:translate-x-0 max-md:hidden">
              {link.name}
            </span>
          </a>
        ))}
      </div>

    </div>
  );
}
