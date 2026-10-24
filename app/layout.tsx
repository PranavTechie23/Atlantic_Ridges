import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";

export const metadata: Metadata = {
  title: "PRYSM — Competitive Intelligence & Market Monitoring Agent",
  description:
    "Evidence-first competitive intelligence platform that turns market noise into competitive signals. Monitored pricing, features, announcements, and executive reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('prysm-theme');
                if (t === 'light') { document.documentElement.classList.remove('dark'); }
                else if (t === 'dark') { document.documentElement.classList.add('dark'); }
              } catch(e){}

              // Permanently suppress Next.js dev overlay / 1 Insight badge
              try {
                var removeDevPortal = function() {
                  var portals = document.querySelectorAll('nextjs-portal, [data-nextjs-portal]');
                  portals.forEach(function(p) { p.remove(); });
                };
                removeDevPortal();
                var observer = new MutationObserver(function() {
                  removeDevPortal();
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
              } catch(e){}
            })();`,
          }}
        />
      </head>
      <body className="bg-app text-app-primary font-sans antialiased selection:bg-blue-500/30 selection:text-blue-950 dark:selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
