import { Box, Stack, type MantineSize } from '@mantine/core';
import { CcText } from '../../index';

interface CcProgressBarProps {
  value: number; 
  label?: string;
  size?: MantineSize;
}

export function CcProgressBar({
  value,
  label,
  size = 'lg',
}: CcProgressBarProps) {
  const startGradient = Math.max(0, value - 15);
  const endGradient = Math.min(100, value + 15);

  const dynamicGradient = `linear-gradient(90deg, 
    #FF914D 0%, 
    #FF914D ${startGradient}%, 
    #8C52FF ${endGradient}%, 
    #8C52FF 100%)`;

  const heightMap = { xs: 5, sm: 10, md: 15, lg: 20, xl: 30 };
  const height = heightMap[size as keyof typeof heightMap] || 24;

  return (
    <Stack gap={4} w="100%">
      {label && <CcText bold size="sm">{label}</CcText>}
      
      <Box
        style={{
          width: '100%',
          height: height,
          background: dynamicGradient,
          borderRadius: '1000px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease', 
        }}
      >
        <CcText
          size={size === 'xs' ? 'xs' : 'sm'}
          style={{ color: '#FFFFFF', zIndex: 1, userSelect: 'none' }}
        >
          {value}%
        </CcText>
      </Box>
    </Stack>
  );
}