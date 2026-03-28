import { Table as ArcoTable, TableProps } from '@arco-design/web-react';
import classNames from 'classnames';
import styles from './index.module.less';
const Table = <T extends object>(props: TableProps<T>) => {
  const { className, ...restProps } = props;
  return (
    <ArcoTable<T>
      className={classNames(styles['table'], className)}
      {...restProps}
    />
  );
};

export default Table;
