"use client"

import { cn } from "@/lib/utils";
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CenteredWithLogo() {
  const pages = [
    {
      title: "Features",
      href: "#",
    },
    {
      title: "Pricing", 
      href: "#",
    },
    {
      title: "Documentation",
      href: "#",
    },
    {
      title: "GitHub",
      href: "#",
    },
    {
      title: "Support",
      href: "#",
    },
  ];

  return (
    <div className="relative border-t border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.7)] backdrop-blur-xl px-8 py-20 w-full overflow-hidden">
      {/* Hemispherical grid background with glow - coming from bottom */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(ellipse 200% 100% at 50% 100%, 
              rgba(0, 255, 136, 0.08) 0%, 
              rgba(0, 255, 136, 0.04) 30%, 
              rgba(0, 255, 136, 0.02) 50%, 
              transparent 70%),
            linear-gradient(to right, rgba(0, 255, 136, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 60px 60px',
          backgroundPosition: '0 0, 0 0, 0 0',
          filter: 'drop-shadow(0 -5px 8px rgba(0, 255, 136, 0.15)) drop-shadow(0 0 3px rgba(0, 255, 136, 0.1))',
          mask: 'radial-gradient(ellipse 200% 100% at 50% 100%, black 0%, black 50%, transparent 80%)',
          WebkitMask: 'radial-gradient(ellipse 200% 100% at 50% 100%, black 0%, black 50%, transparent 80%)'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto text-sm text-[var(--color-muted-foreground)] justify-between items-start md:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center w-full relative">
          <div className="mr-0 md:mr-4 md:flex mb-4">
            <Logo />
          </div>

          <ul className="transition-colors flex sm:flex-row flex-col text-[var(--color-muted-foreground)] list-none gap-4">
            {pages.map((page, idx) => (
              <motion.li 
                key={"pages" + idx} 
                className="list-none"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  className="transition-colors hover:text-[var(--color-primary)] duration-300"
                  href={page.href}
                >
                  {page.title}
                </Link>
              </motion.li>
            ))}
          </ul>

          <GridLineHorizontal className="max-w-7xl mx-auto mt-8" />
        </div>
        <div className="flex sm:flex-row flex-col justify-between mt-8 items-center w-full">
          <p className="text-[var(--color-muted-foreground)] mb-8 sm:mb-0">
            © 2024 AutoDoc AI. Built for developers, by developers.
          </p>
          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="#">
                <Github className="h-5 w-5 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="#">
                <Twitter className="h-5 w-5 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="#">
                <Mail className="h-5 w-5 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "rgba(10,10,10,0.7)",
          "--color": "rgba(0, 255, 136, 0.3)",
          "--height": "1px",
          "--width": "8px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(0, 255, 136, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "w-[calc(100%+var(--offset))] h-[var(--height)]",
        "bg-[linear-gradient(to_right,var(--color-dark),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        className
      )}
    ></div>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-mono text-2xl font-bold text-[var(--color-foreground)] inline-flex items-center relative"
    >
      <motion.span
        className="text-[var(--color-foreground)]"
        whileHover={{
          textShadow: "0 0 20px rgba(0, 255, 136, 0.8)",
        }}
        transition={{ duration: 0.3 }}
      >
        AutoDoc AI
      </motion.span>
      <motion.span
        className="ml-1 text-[var(--color-primary)] animate-pulse"
        animate={{
          textShadow: ["0 0 10px rgba(0, 255, 136, 0.8)", "0 0 20px rgba(0, 255, 136, 1)"],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        _
      </motion.span>
    </Link>
  );
};