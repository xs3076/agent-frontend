import { Button, ButtonProps } from '@arco-design/web-react';
import React from 'react';
import IconFont from '../IconFont';

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: string | React.ReactNode;
  bordered?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  bordered = true,
  style,
  ...rest
}) => {
  const iconNode = typeof icon === 'string' ? <IconFont type={icon} /> : icon;
  return (
    <Button
      {...rest}
      icon={iconNode}
      style={{
        border: bordered ? undefined : 'none',
        boxShadow: bordered ? undefined : 'none',
        background: bordered ? undefined : 'transparent',
        ...style,
      }}
    />
  );
};

export default IconButton;
