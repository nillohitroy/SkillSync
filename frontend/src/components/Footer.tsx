import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="bg-zinc-50 pt-16 pb-8 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      
      {/* Centered container with standard side padding */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <hr className="my-10 border-zinc-200 dark:border-zinc-800" />
        {/* Standard left-aligned grid layout */}
        {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 5 cols */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand Column (Spans 2 columns on tablet and desktop) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-4 w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">SkillSync</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              Hyperlocal Digital Execution. <br />
              Instantly, Affordably, Locally.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-zinc-900 dark:text-zinc-50">Platform</h4>
            <ul className="space-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li><Link href="/features" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Features</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Pricing</Link></li>
              <li><Link href="/docs" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Documentation</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Platform Login</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-zinc-900 dark:text-zinc-50">Ecosystem</h4>
            <ul className="space-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li><Link href="/talent" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">For Talent</Link></li>
              <li><Link href="/register/business" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Post a Job</Link></li>
              <li><Link href="#" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Trust Metrics</Link></li>
              <li><Link href="#" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">Escrow Logic</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-zinc-900 dark:text-zinc-50">Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Terms</Link></li>
              <li><Link href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Privacy</Link></li>
              <li><Link href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Guidelines</Link></li>
            </ul>
          </div>

        </div>

        {/* Inner contained divider */}
        <hr className="my-10 border-zinc-200 dark:border-zinc-800" />

        {/* Centered Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-400 transition-colors hover:text-teal-500 dark:text-zinc-500 dark:hover:text-teal-400">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" className="text-zinc-400 transition-colors hover:text-teal-500 dark:text-zinc-500 dark:hover:text-teal-400">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </a>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} SkillSync Execution Network. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}