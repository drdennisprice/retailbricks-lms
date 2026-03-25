export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} RetailBricks. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="https://retailbricks.com" className="hover:text-brand-600 transition">
            retailbricks.com
          </a>
        </div>
      </div>
    </footer>
  );
}
