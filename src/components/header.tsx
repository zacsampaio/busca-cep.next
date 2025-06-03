import { Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="border-b w-full">
      <div className="flex h-16 items-center gap-6 px-6 mx-auto">
        <Image
          src="/logo-ximenes.png"
          alt="Logo"
          width={48}
          height={48}
          className="rounded-sm"
        />

        <Separator orientation="vertical" />

        <nav className="flex items-center space-x-4 lg:space-x-6 text-muted-foreground hover:text-primary">
          <Link href="/" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar CEP
          </Link>
        </nav>

        <div className="ml-auto flex items-center mr-16">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
