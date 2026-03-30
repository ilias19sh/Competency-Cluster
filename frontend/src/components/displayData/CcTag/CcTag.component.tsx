import { Box, type BoxProps } from '@mantine/core';

interface CcTagProps extends BoxProps {
  id?: string;
  children: React.ReactNode;
}

export function CcTag({ children, ...others }: CcTagProps) {
  return (
    <Box
      {...others}
      component="span"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF66',
        color: '#000000',             
        padding: '4px 12px',        
        borderRadius: '1000px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 500,
        fontSize: '12px',   
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.3)', 
        userSelect: 'none',
        ...others.style,
      }}
    >
      {children}
    </Box>
  );
}