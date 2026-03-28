
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
      <div className={`flex items-center gap-3 ${styles['top']}`}>
        {!!props.logo && (
          <div
            style={{ backgroundColor: props.logoBg }}
            className={styles['logoWrap']}
          >
            <img src={props.logo} alt="" />
          </div>
        )}
        <div className={styles.title}>{props.label}</div>
        {
          <div
            className={classNames(styles['checkIcon'], {
              [styles['active']]: props.isActive,
              [styles['disabled']]: props.disabled,
            })}
          ></div>
        }
      </div>
      {!!props.desc && <div className={styles['desc']}>{props.desc}</div>}
    </div>
  );
}
