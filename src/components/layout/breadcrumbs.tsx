'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Sparkles, Code2, BookOpen, LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
  icon?: LucideIcon;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Icon mapping for main pages
  const getIconForPath = (path: string): LucideIcon | undefined => {
    const iconMap: Record<string, LucideIcon> = {
      '/': Home,
      '/features': Sparkles,
      '/examples': Code2,
      '/documentation': BookOpen,
    };
    return iconMap[path];
  };

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', href: '/', current: false, icon: Home }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Format segment name (capitalize and replace hyphens with spaces)
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast,
        icon: getIconForPath(currentPath)
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if only one item
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center"
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
            )}
            
            {item.current ? (
              <span className="text-sm font-medium text-green-400 flex items-center gap-1.5">
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </span>
            ) : (
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm font-medium text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-1.5"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </motion.a>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}