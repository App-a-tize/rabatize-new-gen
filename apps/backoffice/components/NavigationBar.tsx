'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Tableau de bord' },
  { href: '/rules', label: 'Règles' },
  { href: '/modes', label: 'Modes' }
];

const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="nav-container">
        <Link href="/" className="brand-link">
          Rabatize Backoffice
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
