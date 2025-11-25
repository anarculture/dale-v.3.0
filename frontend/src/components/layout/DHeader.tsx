import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DButton } from "../ui/DButton";
import { DIconButton } from "../ui/DIconButton";
import { User, LogOut, Menu } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

export const DHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <Navbar maxWidth="xl" className="bg-white border-b border-gray-200">
      <NavbarBrand>
        <Link href="/" className="font-bold text-2xl text-primary">
          Dale
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/rides">
            Buscar
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/offer" aria-current="page">
            Publicar
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.email?.charAt(0).toUpperCase()}
                size="sm"
                src={user.user_metadata?.avatar_url}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Conectado como</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="my-rides" href="/rides/my">
                Mis Viajes
              </DropdownItem>
              <DropdownItem key="bookings" href="/bookings">
                Mis Reservas
              </DropdownItem>
              <DropdownItem key="settings" href="/profile">
                Mi Perfil
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Iniciar Sesión</Link>
            </NavbarItem>
            <NavbarItem>
              <DButton as={Link} color="primary" href="/signup" variant="flat">
                Registrarse
              </DButton>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
