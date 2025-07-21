/**
 * Mobile Navigation Bar
 */
import { CogIcon, HomeIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import LangSwitcher from "./lang-switcher";
import ThemeSwitcher from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";

function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email?: string;
  avatarUrl?: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer rounded-lg">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{name}</span>
          <span className="truncate text-xs">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/dashboard" viewTransition>
              <HomeIcon className="size-4" />
              Dashboard
            </Link>
          </SheetClose>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/logout" viewTransition>
              <LogOutIcon className="size-4" />
              Log out
            </Link>
          </SheetClose>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthButtons() {
  return (
    <>
      <Button variant="ghost" asChild>
        <SheetClose asChild>
          <Link to="/login" viewTransition>
            Sign in
          </Link>
        </SheetClose>
      </Button>
      <Button variant="default" asChild>
        <SheetClose asChild>
          <Link to="/join" viewTransition>
            Sign up
          </Link>
        </SheetClose>
      </Button>
    </>
  );
}

function Actions() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button variant="ghost" size="icon">
            <CogIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <SheetClose asChild>
              <Link to="/debug/sentry" viewTransition>
                Sentry
              </Link>
            </SheetClose>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SheetClose asChild>
              <Link to="/debug/analytics" viewTransition>
                Google Tag
              </Link>
            </SheetClose>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeSwitcher />
      <LangSwitcher />
    </>
  );
}

export function NavigationBarMobile({
  name,
  email,
  avatarUrl,
  loading,
}: {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  loading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Sheet>
      <nav className="bg-background/95 flex h-16 w-full items-center justify-between border-b px-5 shadow-xs backdrop-blur-lg transition-opacity">
        <Link to="/">
          <h1 className="text-lg font-extrabold">{t("home.title")}</h1>
        </Link>
        <SheetTrigger className="size-6">
          <MenuIcon />
        </SheetTrigger>
      </nav>
      <SheetContent>
        {/* <SheetHeader>
          <SheetClose asChild>
            <Link to="/blog">Blog</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/contact">Contact</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/payments/checkout">Payments</Link>
          </SheetClose>
        </SheetHeader> */}
        {loading ? (
          <div className="flex items-center">
            <div className="bg-muted-foreground h-4 w-24 animate-pulse rounded-full" />
          </div>
        ) : (
          <SheetFooter>
            {name ? (
              <div className="grid grid-cols-3">
                <div className="col-span-2 flex w-full justify-between">
                  <Actions />
                </div>
                <div className="flex justify-end">
                  <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <Actions />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <AuthButtons />
                </div>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
