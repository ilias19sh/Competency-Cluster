import { Paper, Stack, type PaperProps } from '@mantine/core';

interface CcCardProps extends PaperProps {
  children: React.ReactNode;
}

export function CcCard({ children, ...others }: CcCardProps) {
  return (
    <Paper
      {...others}
      p="xl"
      radius="xl"
      withBorder
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E9ECEF',
        boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
        ...others.style,
      }}
    >
      <Stack gap="md">
        {children}
      </Stack>
    </Paper>
  );
}