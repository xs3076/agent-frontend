import { useInnerLayout } from '@/components/InnerLayout/utils';
import $i18n from '@/i18n';
import { Empty, Pagination, Spin } from '@arco-design/web-react';
import { PaginationProps } from '@arco-design/web-react';
import classNames from 'classnames';
import React from 'react';
import styles from './index.module.less';

interface IProps {
  /**
   * Custom className to override default styles
   */
  className?: string;
  /**
   * Card content, can be any React nodes
   */
  children?: React.ReactNode[];
  /**
   * Pagination configuration
   */
  pagination?: PaginationProps;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Action button to show when data is empty
   */
  emptyAction?: React.ReactNode;
  /**
   * Whether in search state
   */
  isSearch?: boolean;
  /**
   * Props for Empty component
   */
  emptyProps?: {
    title?: string;
    description?: string;
  };
}

const CardList: React.FC<IProps> = (props) => {
  const { className, children } = props;
  const { bottomPortal } = useInnerLayout();

  if (!props.children?.length && !props.loading)
    return (
      <div className="loading-center pt-[20px]">
        <Empty
          title={
            props.isSearch
              ? $i18n.get({
                  id: 'main.pages.App.components.MCPSelector.index.noSearchResult',
                  dm: '暂无搜索结果',
                })
              : $i18n.get({
                  id: 'main.pages.MCP.components.Overview.index.noData',
                  dm: '暂无数据',
                })
          }
          description={
            props.isSearch
              ? $i18n.get({
                  id: 'main.pages.Component.AppComponent.components.AppSelector.index.tryAnotherSearchCondition',
                  dm: '换个搜索条件试试',
                })
              : $i18n.get({
                  id: 'main.components.Card.List.createDataAndRetry',
                  dm: '请创建数据后重试',
                })
          }
          {...(props.emptyProps || {})}
        >
          {!props.isSearch && !!props.emptyAction && (
            <div className="mt-3">{props.emptyAction}</div>
          )}
        </Empty>
      </div>
    );

  return (
    <>
      <div className={classNames(styles['container'], className)}>
        {props.loading ? (
          <Spin loading className={styles['loading']} />
        ) : (
          children
        )}
      </div>
      {props.pagination &&
        bottomPortal(
          <div className="flex justify-end flex-1">
            <Pagination sizeCanChange {...props.pagination} />
          </div>,
        )}
    </>
  );
};

export default CardList;
