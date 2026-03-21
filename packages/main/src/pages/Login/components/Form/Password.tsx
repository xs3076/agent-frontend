import $i18n from '@/i18n';
import { Input, InputProps } from '@spark-ai/design';
import { LockOutlined } from '@ant-design/icons';
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
        <LockOutlined className={styles['prefix-icon']} />
      }
      {...restProps}
    />
  );
};

export default Password;
