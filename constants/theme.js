export const T = {
  bg: '#FAFAF8',
  bgAlt: '#F4F3EF',
  bgCard: '#FFFFFF',
  navy: '#0F1629',
  navyMid: '#2D3A52',
  slate: '#5C6880',
  slateLight: '#8C97A8',
  border: 'rgba(15,22,41,0.07)',
  borderMid: 'rgba(15,22,41,0.12)',
  amber: '#D97706',
  amberLight: '#F59E0B',
  amberBg: '#FFFBEB',
  amberBorder: 'rgba(217,119,6,0.18)',
  teal: '#0D9488',
  tealBg: 'rgba(13,148,136,0.06)',
  tealBorder: 'rgba(13,148,136,0.16)',
  tealDark: '#0F766E',
  emerald: '#059669',
  emeraldBg: 'rgba(5,150,105,0.06)',
  red: '#DC2626',
  redBg: 'rgba(220,38,38,0.06)',
  redBorder: 'rgba(220,38,38,0.18)',
  purple: '#7C3AED',
  purpleBg: 'rgba(124,58,237,0.06)',
  shadow: '0 1px 3px rgba(15,22,41,0.05), 0 4px 16px rgba(15,22,41,0.05)',
  shadowMd: '0 2px 8px rgba(15,22,41,0.06), 0 8px 32px rgba(15,22,41,0.08)',
  shadowAmber: '0 8px 32px rgba(217,119,6,0.20)',
  shadowLg: '0 4px 16px rgba(15,22,41,0.07), 0 16px 48px rgba(15,22,41,0.09)'
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
