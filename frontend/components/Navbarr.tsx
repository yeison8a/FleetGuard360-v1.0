'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@heroui/react';
import { useAuth } from '@/app/context/AuthContext';
import logo from '../app/LogoFeet.png';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Navbarr() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const showGoToDashboard = isLoggedIn && pathname !== '/dashboard';

  return (
    <Navbar>
      <NavbarBrand>
        <Image
          src={logo}
          alt="FleetGuard360 Logo"
          width={48}
          height={48}
          className="rounded"
        />
        <p className="font-bold text-inherit">FG360</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {showGoToDashboard && (
          <NavbarItem>
            <Button variant="ghost" onClick={goToDashboard}>
              Lista alertas
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {!isLoggedIn ? (
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          ) : (
            <Button color="danger" variant="flat" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
