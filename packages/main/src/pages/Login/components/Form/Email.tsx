import $i18n from '@/i18n';
import { Input, InputProps } from '@spark-ai/design';
import { MailOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import styles from './Email.module.less';

const Email: React.FC<InputProps> = (props) => {
  const {
    placeholder = $i18n.get({
      id: 'main.pages.Login.components.Form.Email.enterYourAccount',
      dm: '输入您的账号',
    }),
    className,
    ...restProps
  } = props;

  return (
    <Input
      className={classNames(styles['email'], className)}
      placeholder={placeholder}
      prefix={
        <MailOutlined className={styles['prefix-icon']} />
      }
      allowClear
      {...restProps}
    />
  );
};

export default Email;
