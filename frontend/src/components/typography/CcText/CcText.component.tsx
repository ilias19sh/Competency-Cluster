// src/components/ui/CcText.tsx
import { Text, type TextProps } from '@mantine/core';

interface CcTextProps extends Omit<TextProps, 'span' | 'color'> {
  children: React.ReactNode;
  inline?: boolean;
  italic?: boolean;
  bold?: boolean;
  dimmed?: boolean;
  size?: TextProps['size'];
  color?: string; 
}

export function CcText({
  children,
  inline = false,
  italic = false,
  bold = false,
  dimmed = false,
  size = 'md',
  color = '#777777', 
  ...others
}: CcTextProps) {
  return (
    <Text
      {...others}
      size={size}
      span={inline}
      style={{
        color: color,
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? 'italic' : 'normal',
        opacity: dimmed ? 0.6 : 1,
        transition: 'opacity 0.2s ease',
        lineHeight: 1.5,
        ...others.style, 
      }}
    >
      {children}
    </Text>
  );
}