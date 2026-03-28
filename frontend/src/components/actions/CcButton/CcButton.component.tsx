import { Button, type ButtonProps } from '@mantine/core';

type CcButtonVariant = 'default-gradient' | 'full-orange' | 'full-violet';

interface CcButtonProps extends OtitleProps {
  variant?: CcButtonVariant;
  size?: ButtonProps['size'];
  disabled?: boolean;
  expandable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

type OtitleProps = Omit<ButtonProps, 'variant' | 'size' | 'onClick' | 'children'>;

export function CcButton({
  variant = 'default-gradient',
  size = 'md',
  disabled = false,
  expandable = false,
  onClick,
  children,
  ...others
}: CcButtonProps) {
  
  const getVariantProps = () => {
    switch (variant) {
      case 'full-orange':
        return { color: 'orange', variant: 'filled' };
      case 'full-violet':
        return { color: 'violet', variant: 'filled' };
      case 'default-gradient':
      default:
        return {
          variant: 'gradient',
          gradient: { from: 'violet', to: 'orange', deg: 90 },
        };
    }
  };

  const variantProps = getVariantProps();

  return (
    <Button
      {...variantProps}
      {...others}
      size={size}
      disabled={disabled}
      fullWidth={expandable}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}