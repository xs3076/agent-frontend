import $i18n from '@/i18n';
import { Dropdown, Menu } from '@arco-design/web-react';
import IconButton from '@/components/IconButton';
import IconFont from '@/components/IconFont';
import React from 'react';

const lang = $i18n.getCurrentLanguage();

export default function () {
  const icon = {
    zh: 'spark-chinese02-line',
    en: 'spark-english02-line',
    ja: 'spark-japan-line',
  }[lang];

  const button = <IconButton bordered={false} icon={icon} />;

  return (
    <Dropdown
      trigger="click"
      droplist={
        <Menu onClickMenuItem={(key) => {
          $i18n.setCurrentLanguage(key);
          location.reload();
        }}>
          <Menu.Item key="en">
            <div className="flex items-center gap-[4px]">
              <IconFont type="spark-english02-line" /> English
            </div>
          </Menu.Item>
          <Menu.Item key="zh">
            <div className="flex items-center gap-[4px]">
              <IconFont type="spark-chinese02-line" /> 简体中文
            </div>
          </Menu.Item>
          <Menu.Item key="ja">
            <div className="flex items-center gap-[4px]">
              <IconFont type="spark-japan-line" /> 日本語
            </div>
          </Menu.Item>
        </Menu>
      }
    >
      {button}
    </Dropdown>
  );
}
