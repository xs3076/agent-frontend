import IconFont from '@/components/ui/IconFont';
import classNames from 'classnames';
import styles from './index.module.less';

export interface IRadioItemProps {
  label: string;
  value: string;
  logo?: string;
  desc?: React.ReactNode;
  disabled?: boolean;
  logoBg?: string;
}

interface IProps extends IRadioItemProps {
  isActive?: boolean;
  className?: string;
  onSelect?: () => void;
}

export default function RadioItem(props: IProps) {
  return (
    <div
      onClick={() => {
        if (props.disabled || props.isActive || !props.onSelect) return;
        props.onSelect();
      }}
      className={classNames(styles['radio-item'], props.className, {
        [styles.active]: props.isActive,
        [styles.disabled]: props.disabled,
      })}
    >
      <div className={`flex gap-3 items-center ${styles.top}`}>
        {!!props.logo && (
          <div
            style={{ backgroundColor: props.logoBg }}
            className={styles['logo-wrap']}
          >
            <IconFont style={{ fontSize: 27 }} type={props.logo} />
          </div>
        )}
        <div className={styles.title}>{props.label}</div>
        {props.isActive && <div className={styles['check-icon']}></div>}
      </div>
      {!!props.desc && <div className={styles.desc}>{props.desc}</div>}
    </div>
  );
}
