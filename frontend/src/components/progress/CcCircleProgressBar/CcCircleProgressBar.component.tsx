import { Box, Stack } from '@mantine/core';

interface CcCircleProgressProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
}

export function CcCircleProgress({
  value,
  size = 120,
  thickness = 9,
  label,
}: CcCircleProgressProps) {
  
  const angle = (value / 100) * 360;
  
  const conicGradient = `conic-gradient(
    from 0deg,
    #8C52FF 0deg,
    #8C52FF ${angle - 100}deg, 
    #FF914D ${angle}deg,
    #FF914D 350deg,
    #8C52FF 360deg
  )`;

  const gradientTextStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #8C52FF 0%, #FF914D 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 1,
  };

  return (
    <Box 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >

      <Box
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: conicGradient,
          WebkitMask: `radial-gradient(transparent ${size / 2 - thickness}px, black ${size / 2 - thickness}px)`,
          mask: `radial-gradient(transparent ${size / 2 - thickness}px, black ${size / 2 - thickness}px)`,
        }}
      />

      <Stack gap={4} align="center" justify="center" style={{ zIndex: 2 }}>
        <span style={{ 
          ...gradientTextStyle, 
          fontWeight: 500, 
          fontSize: `${size / 4}px` 
        }}>
          {value}%
        </span>
        
        {label && (
          <span style={{ 
            ...gradientTextStyle, 
            fontWeight: 500, 
            marginTop: `${size / 10}px`,
            fontSize: `${size / 13}px`,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {label}
          </span>
        )}
      </Stack>
    </Box>
  );
}