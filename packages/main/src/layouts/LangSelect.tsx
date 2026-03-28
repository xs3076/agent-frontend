import $i18n from '@/i18n';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
import { Dropdown, Menu } from '@arco-design/web-react';
import { setWorkFlowLanguage } from '@spark-ai/flow';
import { useMount } from 'ahooks';

export default function () {
  const language = $i18n.getCurrentLanguage();

  const icon = {
    zh: 'spark-chinese02-line',
    en: 'spark-english02-line',
    ja: 'spark-japan-line',
  }[language];

  useMount(() => {
    setWorkFlowLanguage(language);
  });

  const button = <IconButton bordered={false} icon={icon} />;

  const droplist = (
    <Menu
      onClickMenuItem={(key) => {
        $i18n.setCurrentLanguage(key);
        setWorkFlowLanguage(key);
        location.reload();
      }}
    >
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
    </Menu>
  );

  return (
    <Dropdown droplist={droplist} trigger="click">
      {button}
    </Dropdown>
  );
}
