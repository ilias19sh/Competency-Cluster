import { Paper, Stack, type PaperProps, type MantineSpacing } from '@mantine/core';

interface CcCardProps extends PaperProps {
  children: React.ReactNode;
  withStack?: boolean;
  stackGap?: MantineSpacing;
}

export function CcCard({
  children,
  withStack = true,
  stackGap = 'md',
  p = 'xl',
  radius = 'xl',
  withBorder = true,
  style,
  ...others
}: CcCardProps) {
  const content = withStack ? <Stack gap={stackGap}>{children}</Stack> : children;

  return (
    <Paper
      {...others}
      p={p}
      radius={radius}
      withBorder={withBorder}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E9ECEF',
        boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
        ...style,
      }}
    >
      {content}
    </Paper>
  );
}
