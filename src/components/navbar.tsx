import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">
          <Link href="/">My App</Link>
        </h1>
        <div className="space-x-4">
          <Link href="/scroll-feed" className="hover:underline">
            Scroll Feed
          </Link>
          <Link href="/wheel-feed" className="hover:underline">
            Wheel Feed
          </Link>
        </div>
      </div>
    </nav>
  );
}
