import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { project, spring, useTransitions } from '@/lib/motion';
import { useSheet } from '@/hooks/use-sheet';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Leadership', href: '#leadership' },
  { name: 'Writing', href: '#writing' },
  { name: 'Contact', href: '#contact' },
];

/** How far the sheet travels to tuck itself back behind the bar. */
const SHEET_TRAVEL = 340;
/** Past this projected offset — or this release speed — the flick wins. */
const DISMISS_OFFSET = -90;
const DISMISS_VELOCITY = -400;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const t = useTransitions();

  // Carried into the exit spring so there's no seam between finger and animation
  const releaseVelocity = useRef(0);

  const y = useMotionValue(0);
  const scrimOpacity = useTransform(y, [-SHEET_TRAVEL, 0], [0, 1]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const sheetRef = useSheet(isMenuOpen, closeMenu, { lockScroll: true });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) y.set(0);
  }, [isMenuOpen, y]);

  return (
    <>
      <motion.nav
        initial={{ y: t.reduced ? 0 : -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={t.gentle}
        className="fixed inset-x-0 top-4 z-50 px-4"
      >
        <div
          className={`mx-auto max-w-6xl rounded-full transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
            isScrolled ? 'material-bar shadow-e2' : 'border-transparent bg-transparent'
          }`}
        >
          <div className="flex h-14 items-center justify-between px-4 md:px-5">
            <a
              href="#"
              aria-label="Back to top"
              className="press flex items-center gap-2.5 text-foreground/80 hover:text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-body-sm font-semibold">
                V
              </span>
              <span className="hidden text-body-sm font-medium sm:block">Vidyut</span>
            </a>

            <div
              className="relative hidden items-center gap-0.5 md:flex"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  className="press relative rounded-full px-3.5 py-1.5 text-caption font-medium text-muted-foreground hover:text-foreground"
                >
                  {hoveredLink === link.name && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-foreground/[0.07]"
                      transition={spring.snappy}
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <Button variant="hero-outline" size="sm" asChild>
                <a href="#contact">Get in touch</a>
              </Button>
            </div>

            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="press rounded-full p-2 text-foreground hover:bg-foreground/[0.06] md:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/*
              The sheet blocks, so it dims. Two layers on purpose: the outer one
              owns the mount/unmount fade, the inner one tracks the drag live —
              a single element can't do both, because a derived motion value in
              `style` overrides anything variants try to animate.
            */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={t.standard}
              className="fixed inset-0 z-30 md:hidden"
            >
              {/* Pointer shortcut only — Escape and the toggle already dismiss */}
              <motion.div
                onClick={closeMenu}
                aria-hidden="true"
                style={{ opacity: t.reduced ? 1 : scrimOpacity }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              />
            </motion.div>

            <motion.div
              key="sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              tabIndex={-1}
              /* Enters from above and leaves the same way, tucking behind the bar */
              initial={{ y: t.reduced ? 0 : -SHEET_TRAVEL, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: t.reduced ? 0 : -SHEET_TRAVEL,
                opacity: 0,
                transition: t.reduced
                  ? t.standard
                  : { ...spring.standard, velocity: releaseVelocity.current },
              }}
              transition={t.standard}
              style={{ y, originY: 0 }}
              drag={t.reduced ? false : 'y'}
              /* Free 1:1 upward; past the open position, resistance instead of a wall */
              dragConstraints={{ top: -SHEET_TRAVEL, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              onDragEnd={(_, info) => {
                const projected = info.offset.y + project(info.velocity.y);
                if (info.velocity.y < DISMISS_VELOCITY || projected < DISMISS_OFFSET) {
                  releaseVelocity.current = info.velocity.y;
                  closeMenu();
                } else {
                  animate(y, 0, { ...spring.standard, velocity: info.velocity.y });
                }
              }}
              className="material-sheet drag-y fixed inset-x-4 top-20 z-40 overflow-hidden rounded-2xl md:hidden"
            >
              <nav className="flex flex-col gap-0.5 p-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="press-soft press vibrant rounded-xl px-4 py-3 text-body-sm hover:bg-foreground/[0.07]"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/[0.07] pt-3">
                  <Button variant="hero" className="w-full" asChild>
                    <a href="#contact" onClick={closeMenu}>
                      Get in touch
                    </a>
                  </Button>
                </div>
              </nav>

              {/* Grab handle — tells you it can be dragged before you try */}
              <div className="flex justify-center pb-2.5" aria-hidden="true">
                <span className="h-1 w-9 rounded-full bg-foreground/20" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
