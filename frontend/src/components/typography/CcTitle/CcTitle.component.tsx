import { Title, Group, type TitleProps } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

interface CcTitleProps {
  children: React.ReactNode;
  order?: TitleProps['order'];
  disabled?: boolean;
  withChevron?: boolean;
  bold?: boolean;
  italic?: boolean;
}

export function CcTitle({ 
  children, 
  order = 1, 
  disabled = false, 
  withChevron = true,
  bold = false,
  italic = false
}: CcTitleProps) {
  return (
    <Group gap="xs" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Title
        order={order}
        style={{
          color: disabled ? 'var(--mantine-color-gray-4)' : '#777777',
          fontWeight: bold ? 700 : 500, 
          fontStyle: italic ? 'italic' : 'normal',
          transition: 'color 0.2s ease',
        }}
      >
        {children}
      </Title>
      
      {withChevron && (
        <IconChevronRight
          size="1.2em"
          color={disabled ? 'var(--mantine-color-gray-4)' : '#777777'}
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
      )}
    </Group>
  );
}