import ProCard from '@/components/Card/ProCard';
import $i18n from '@/i18n';
import { IAppComponentListItem } from '@/types/appComponent';
import { Button, Dropdown, Menu } from '@arco-design/web-react';
import IconButton from '@/components/ui/IconButton';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { APP_ICON_IMAGE } from '../AppSelector';
import styles from './index.module.less';
export interface AppComponentCardProps extends IAppComponentListItem {
  onClickAction: (key: string) => void;
}

const AppComponentCard: React.FC<AppComponentCardProps> = ({
  code,
  name,
  gmt_modified,
  type,
  onClickAction,
  description,
}) => {
  const updateTime = useMemo(() => {
    return dayjs(gmt_modified).format('YYYY-MM-DD HH:mm:ss');
  }, [gmt_modified]);

  return (
    <ProCard
      title={name!}
      info={[
        {
          label: $i18n.get({
            id: 'main.pages.Component.AppComponent.components.Card.index.componentDescription',
            dm: '组件描述',
          }),
          content: description,
        },
        {
          label: $i18n.get({
            id: 'main.pages.Component.AppComponent.components.Card.index.componentId',
            dm: '组件ID',
          }),
          content: code,
        },
      ]}
      logo={<img className={styles['logo']} src={APP_ICON_IMAGE[type!]} />}
      onClick={() => onClickAction('detail')}
      footerDescNode={
        <div className={styles.bottom}>
          {$i18n.get({
            id: 'main.pages.Component.AppComponent.components.Card.index.updatedAt',
            dm: '更新于',
          })}
          {updateTime}
        </div>
      }
      footerOperateNode={
        <>
          <Button
            type="primary"
            className="flex-1"
            onClick={() => onClickAction('edit')}
          >
            {$i18n.get({
              id: 'main.pages.Component.AppComponent.components.Card.index.edit',
              dm: '编辑',
            })}
          </Button>
          <Button className="flex-1" onClick={() => onClickAction('gotoApp')}>
            {$i18n.get({
              id: 'main.pages.Component.AppComponent.components.Card.index.viewOriginalApplication',
              dm: '查看原应用',
            })}
          </Button>
          <Dropdown
            getPopupContainer={(ele) => ele}
            droplist={
              <Menu onClickMenuItem={(key) => {
                if (key === 'detail') onClickAction('referDetail');
                if (key === 'delete') onClickAction('delete');
              }}>
                <Menu.Item key="detail">
                  {$i18n.get({
                    id: 'main.pages.Component.AppComponent.components.Card.index.componentReferenceDetails',
                    dm: '组件引用详情',
                  })}
                </Menu.Item>
                <Menu.Item key="delete" className="text-red-500">
                  {$i18n.get({
                    id: 'main.pages.Component.AppComponent.components.Card.index.delete',
                    dm: '删除',
                  })}
                </Menu.Item>
              </Menu>
            }
          >
            <IconButton shape="default" icon="spark-more-line" />
          </Dropdown>
        </>
      }
    />
  );
};

export default AppComponentCard;
