import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { BREAKPOINTS } from '../../core/config/env';

type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'wide';

function getSize(width: number): ScreenSize {
  if (width >= BREAKPOINTS.wide) return 'wide';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Responsive breakpoint hook. Returns current screen size category.
 */
export function useResponsive() {
  const [dims, setDims] = useState(Dimensions.get('window'));

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => setDims(window);
    const sub = Dimensions.addEventListener('change', handler);
    return () => sub.remove();
  }, []);

  return {
    width: dims.width,
    height: dims.height,
    size: getSize(dims.width),
    isMobile: dims.width < BREAKPOINTS.tablet,
    isTablet: dims.width >= BREAKPOINTS.tablet && dims.width < BREAKPOINTS.desktop,
    isDesktop: dims.width >= BREAKPOINTS.desktop,
  };
}
