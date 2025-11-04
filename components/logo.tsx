import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link
      href="/"
      prefetch={true}
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      aria-label="Story AI Home"
    >
      <div className="flex items-center justify-center w-8 h-8 relative">
        <Image
          src="/images/storybook_logo.png"
          alt="Story AI Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          priority
        />
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Story AI
      </span>
    </Link>
  );
}
