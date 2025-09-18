import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import NavigationBar from '@/components/NavigationBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Backoffice Rabatize',
  description:
    'Interface d’administration pour orchestrer les règles et modes de jeux de Rabatize avec un déploiement automatisé sur Vercel.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <div className="visually-hidden" id="__next-skip-link-anchor" />
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        <NavigationBar />
        <main id="main-content" className="page-shell">
          {children}
        </main>
        <footer className="page-footer">
          <div className="nav-container">
            <p>
              Conçu pour le backoffice Rabatize – synchronisation LiveOps &amp; Vercel.
            </p>
            <Link href="https://vercel.com" target="_blank" rel="noreferrer" className="nav-link subtle">
              Infrastructure Vercel
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
