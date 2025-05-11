"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart-icon";

export default function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Feed",
      path: "/feed",
      icon: Compass,
    },
    {
      name: "Explore",
      path: "/explore",
      icon: Search,
    },
    {
      name: "Cart",
      path: "/cart",
      icon: CartIcon,
    },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="bg-gradient-to-r from-cyan-900 to-teal-600 bg-clip-text text-xl font-bold text-transparent">
                ScrollCart
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {routes.map((route) => {
                if (route.name !== "Cart") {
                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={cn(
                        "hover:text-foreground/80 transition-colors",
                        pathname === route.path
                          ? "text-foreground font-semibold"
                          : "text-foreground/60",
                      )}
                    >
                      {route.name}
                    </Link>
                  );
                }
              })}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href={"/cart"} key={"/cart"}>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <CartIcon />
                </Button>
              </Link>

              <Button variant="ghost" hidden={true}>
                Sign in
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-white md:hidden">
        <div className="flex h-16 items-center justify-around">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex h-full flex-1 flex-col items-center justify-center",
                  pathname === route.path ? "text-teal-600" : "text-gray-500",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1 text-xs">{route.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
