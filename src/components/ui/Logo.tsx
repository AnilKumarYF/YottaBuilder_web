import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Official YottaBuilder lockup (as used on the live site). Dark backgrounds only — the wordmark is white. */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="YottaBuilder home" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image src="/brand/yottabuilder-logo.png" alt="YottaBuilder" width={727} height={114} priority={priority} className="h-6 w-auto sm:h-7" />
    </Link>
  );
}

/** Official YottaFlex.ai horizontal logo — never recoloured or stretched. */
export function YottaFlexMark({ className, tone = "white" }: { className?: string; tone?: "white" | "blue" }) {
  return (
    <Image
      src={tone === "white" ? "/brand/yottaflex-horizontal-white.png" : "/brand/yottaflex-horizontal-blue.png"}
      alt="YottaFlex.ai"
      width={1180}
      height={194}
      className={cn("h-5 w-auto", className)}
    />
  );
}
