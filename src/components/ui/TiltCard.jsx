import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MAX_TILT, PARALLAX, SPRING_STIFFNESS, SPRING_DAMPING } from '../../lib/tilt';

const CARD_RADIUS = 24;
const MAGNET_MAX = 8;

export default function TiltCard({
  as: Component = 'div',
  children,
  className = '',
  image,
  srcset,
  fallback,
  blur,
  alt,
  index = 0,
  accent,
  hasLive = false,
  enableMagnet = true,
  indexBadge,
  year,
  arrowIcon,
  ...props
}) {
  const cardRef = useRef(null);
  const arrowRef = useRef(null);
  const imgRef = useRef(null);
  const rectRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [tiltDisabled, setTiltDisabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const ax = useSpring(rx, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const ay = useSpring(ry, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const rotateX = useTransform(ax, (v) => v + 'deg');
  const rotateY = useTransform(ay, (v) => -v + 'deg');
  const glowX = useTransform(ax, [-MAX_TILT, MAX_TILT], [100, 0]);
  const glowY = useTransform(ay, [-MAX_TILT, MAX_TILT], [0, 100]);
  const arrowX = useMotionValue(0);
  const arrowY = useMotionValue(0);
  const arrowXSpring = useSpring(arrowX, { stiffness: SPRING_STIFFNESS * 0.8, damping: SPRING_DAMPING * 0.8 });
  const arrowYSpring = useSpring(arrowY, { stiffness: SPRING_STIFFNESS * 0.8, damping: SPRING_DAMPING * 0.8 });
  const imgX = useTransform(ax, (v) => (-v * PARALLAX) / MAX_TILT + 'px');
  const imgY = useTransform(ay, (v) => (v * PARALLAX) / MAX_TILT + 'px');
  const shadowX = useTransform(ax, (v) => -v * 5 + 'px');
  const shadowY = useTransform(ay, (v) => v * 7 + 'px');

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse), (hover: none)');
    const update = () => {
      setReducedMotion(mqReduced.matches);
      setTiltDisabled(mqReduced.matches || mqCoarse.matches);
    };
    update();
    mqReduced.addEventListener?.('change', update);
    mqCoarse.addEventListener?.('change', update);
    return () => {
      mqReduced.removeEventListener?.('change', update);
      mqCoarse.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '100px' }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete) setImgLoaded(true);
  }, []);

  useEffect(() => {
    const onInvalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener('resize', onInvalidate, { passive: true });
    window.addEventListener('scroll', onInvalidate, { passive: true });
    return () => {
      window.removeEventListener('resize', onInvalidate);
      window.removeEventListener('scroll', onInvalidate);
    };
  }, []);

  const handlePointerEnter = () => {
    if (tiltDisabled) return;
    setHovered(true);
    if (!rectRef.current && cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (e) => {
    if (tiltDisabled || !rectRef.current) return;
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rx.set((x / rect.width - 0.5) * 2 * MAX_TILT);
    ry.set((y / rect.height - 0.5) * 2 * MAX_TILT);
    if (enableMagnet && arrowRef.current) {
      const mx = x - rect.width / 2;
      const my = y - rect.height / 2;
      const dist = Math.hypot(mx, my);
      const pull = Math.min(MAGNET_MAX, (dist / 100) * MAGNET_MAX);
      const angle = Math.atan2(my, mx);
      arrowX.set(Math.cos(angle) * pull);
      arrowY.set(Math.sin(angle) * pull);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setPressed(false);
    rx.set(0);
    ry.set(0);
    arrowX.set(0);
    arrowY.set(0);
  };

  const handlePointerDown = () => {
    if (!tiltDisabled) setPressed(true);
  };

  const handlePointerUp = () => setPressed(false);

  const entranceAnim = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28, rotateX: 6, filter: 'blur(6px)' },
        animate: visible ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' } : {},
        transition: { duration: 0.8, delay: index % 2 === 1 ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] },
      };

  const accentColor = accent || '#a3e635';
  const shadowBg = 'radial-gradient(60% 100% at 50% 0%, ' + accentColor + '40 0%, transparent 70%)';
  const glowBg =
    'radial-gradient(250px 200px at ' + glowX.get() + '% ' + glowY.get() + '%, ' + accentColor + '40 0%, transparent 70%)';
  const shadowTransform = tiltDisabled
    ? 'none'
    : 'translate3d(' + shadowX.get() + ', ' + shadowY.get() + ', 0) scaleX(' + (hovered ? 1.06 : 1) + ')';
  const imgTransform = tiltDisabled
    ? 'none'
    : 'translate3d(' + imgX.get() + ', ' + imgY.get() + ', 14px) scale(1.04)';
  const scale = pressed ? 'scale-[0.99]' : hovered && !reducedMotion ? 'scale-[1.02]' : 'scale-100';

  return (
    <Component
      ref={cardRef}
      className={'group block [perspective:1100px] [transform-style:preserve-3d] ' + className}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={hovered && !reducedMotion ? { willChange: 'transform' } : {}}
      {...props}
    >
      <motion.div
        className={
          'relative w-full rounded-card transform-gpu transition-transform duration-500 ease-out [transform-style:preserve-3d] ' +
          scale
        }
        style={{ rotateX: tiltDisabled ? 0 : rotateX, rotateY: tiltDisabled ? 0 : rotateY }}
        {...entranceAnim}
      >
        <motion.div
          className="pointer-events-none absolute -bottom-6 left-1/2 h-24 w-[85%] rounded-[32px] blur-2xl transition-opacity duration-500"
          aria-hidden="true"
          style={{
            background: shadowBg,
            translate: '-50% 0',
            transform: shadowTransform,
            opacity: tiltDisabled ? 0 : hovered ? 0.6 : 0.3,
          }}
        />
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-surface [transform:translateZ(0)]"
          style={{ borderRadius: CARD_RADIUS + 'px' }}
        >
          {blur && (
            <img
              src={blur}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          )}
          {image && (
            <motion.picture style={{ transform: imgTransform }}>
              {srcset && (
                <source
                  srcSet={srcset}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <img
                ref={imgRef}
                src={fallback || image}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={alt || ''}
                loading="lazy"
                decoding="async"
                width={1600}
                height={1200}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                className={
                  'h-full w-full object-cover will-change-transform transition-opacity duration-500 ' +
                  (imgLoaded ? 'opacity-100' : 'opacity-0')
                }
              />
            </motion.picture>
          )}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 [transform:translateZ(16px)]"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 100%)' }}
            aria-hidden="true"
          />
          {!tiltDisabled && (
            <motion.div
              className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-500 [transform:translateZ(18px)]"
              style={{ background: glowBg, opacity: hovered && !reducedMotion ? 0.5 : 0 }}
            />
          )}
        </div>
        {indexBadge !== undefined && indexBadge !== null && indexBadge !== '' && (
          <motion.span className="mono-label absolute left-4 top-4 rounded-full border border-line bg-glass px-3 py-1.5 backdrop-blur-md [transform:translateZ(30px)]">
            {indexBadge}
          </motion.span>
        )}
        {year && (
          <motion.span
            className="mono-label absolute right-4 top-4 rounded-full px-3 py-1.5 backdrop-blur-md [transform:translateZ(30px)]"
            style={{
              backgroundColor: accentColor + '1A',
              color: accentColor,
              border: '1px solid ' + accentColor + '40',
            }}
          >
            {year}
          </motion.span>
        )}
        {hasLive && (
          <motion.span className="mono-label absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 text-accent backdrop-blur-md [transform:translateZ(30px)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            LIVE
          </motion.span>
        )}
        <motion.div
          className="absolute bottom-4 right-4"
          style={{ x: arrowXSpring, y: arrowYSpring, z: 44 }}
        >
          <span
            ref={arrowRef}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-fg transition-all duration-500 ease-out group-hover:rotate-45 group-hover:border-line-hover group-hover:bg-accent group-hover:text-[#0A0A0A]"
            aria-hidden="true"
          >
            {arrowIcon || <span>&rarr;</span>}
          </span>
        </motion.div>
        <motion.div className="mt-5 flex items-start justify-between gap-6 [transform:translateZ(10px)]">
          {children}
        </motion.div>
      </motion.div>
    </Component>
  );
}
