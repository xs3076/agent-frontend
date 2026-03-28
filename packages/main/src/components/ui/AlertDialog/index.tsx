import { Modal } from '@arco-design/web-react';
import React from 'react';

export interface AlertDialogOptions {
  title: string;
  content: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

const AlertDialog = {
  warning(options: AlertDialogOptions) {
    return Modal.confirm({
      title: options.title,
      content: options.content,
      onOk: options.onOk,
      onCancel: options.onCancel,
    });
  },
  confirm(options: AlertDialogOptions) {
    return Modal.confirm({
      title: options.title,
      content: options.content,
      onOk: options.onOk,
      onCancel: options.onCancel,
    });
  },
};

export default AlertDialog;
