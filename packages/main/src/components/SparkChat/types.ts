import { ReactNode } from 'react';

export interface CardItem {
  code: string;
  data: any;
}

export interface TMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  msgStatus?: 'finished' | 'generating' | 'interrupted' | 'error';
  cards?: CardItem[];
  [key: string]: any;
}

export interface ChatAnywhereOnInput {
  onSubmit: (data: any) => void;
  beforeSubmit?: () => Promise<boolean>;
  maxLength?: number;
  zoomable?: boolean;
}

export interface ChatAnywhereUploadConfig {
  multiple?: boolean;
  icon?: ReactNode;
  accept?: string;
  customRequest?: (options: any) => void;
  maxCount?: number;
}

export interface ChatAnywhereProps {
  onInput?: ChatAnywhereOnInput | ((data: any) => void);
  uiConfig?: {
    welcome?: ReactNode;
    mobile?: boolean;
    background?: string;
  };
  onStop?: () => void;
  cardConfig?: Record<string, React.ComponentType<any>>;
  onUpload?: ChatAnywhereUploadConfig[];
}

export interface ChatAnywhereRef {
  updateMessage: (msg: TMessage) => TMessage[];
  removeMessage: (msg: Partial<TMessage>) => void;
  getMessage: (id: string) => TMessage | undefined;
  getMessages: () => TMessage[];
  removeAllMessages: () => void;
  setLoading: (loading: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  scrollToBottom: () => void;
  reload: () => void;
  onInput: ChatAnywhereOnInput;
}

export interface AccordionStepItem {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
}

export interface AccordionProps {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
  status?: 'finished' | 'generating' | 'interrupted' | 'error';
  steps?: AccordionStepItem[];
  defaultOpen?: boolean;
}
