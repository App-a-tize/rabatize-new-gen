import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
        {children}
      </body>
    </html>
  );
}
