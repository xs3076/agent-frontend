import $i18n from '@/i18n';
import { Input } from '@arco-design/web-react';
import type { InputProps } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';
import classNames from 'classnames';
import React from 'react';
import styles from './Password.module.less';

const Password: React.FC<InputProps> = (props) => {
  const {
    placeholder = $i18n.get({
      id: 'main.pages.Login.components.Form.Password.enterYourPassword',
      dm: '输入您的密码',
    }),
    className,
    ...restProps
  } = props;

  return (
    <Input.Password
      className={classNames(styles['password'], className)}
      placeholder={placeholder}
      prefix={
        <IconFont type="spark-apiKey-line" className={styles['prefix-icon']} />
      }
      {...restProps}
    />
  );
};

export default Password;
