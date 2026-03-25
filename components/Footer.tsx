export default function Footer() {
  return (
    <footer className="border-t border-dark-card py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p className="font-heading tracking-wide">
          <span className="text-slate-400">RETAIL</span>
          <span className="text-brand">BRICKS</span>
        </p>
        <p>© {new Date().getFullYear()} RetailBricks. All rights reserved.</p>
        <a
          href="https://retailbricks.com"
          className="hover:text-brand transition"
        >
          retailbricks.com
        </a>
      </div>
    </footer>
  );
}
