import { Button, Input, Upload } from '@arco-design/web-react';
import { IconSend, IconRecordStop } from '@arco-design/web-react/icon';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ChatAnywhereProps, ChatAnywhereRef, TMessage } from './types';
// @ts-ignore
import styles from './ChatAnywhere.module.less';

const { TextArea } = Input;

const ChatAnywhere = forwardRef<ChatAnywhereRef, ChatAnywhereProps>(
  (props, ref) => {
    const { onInput, uiConfig, onStop, cardConfig = {}, onUpload } = props;
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [loading, setLoadingState] = useState(false);
    const [disabled, setDisabledState] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [fileListMap, setFileListMap] = useState<Record<number, any[]>>({});
    const listRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<TMessage[]>([]);

    useEffect(() => {
      messagesRef.current = messages;
    }, [messages]);

    const scrollToBottom = useCallback(() => {
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      });
    }, []);

    const updateMessage = useCallback(
      (msg: TMessage): TMessage[] => {
        let updated = false;
        const newMessages = messagesRef.current.map((m) => {
          if (m.id === msg.id) {
            updated = true;
            return { ...m, ...msg };
          }
          return m;
        });
        if (!updated) {
          newMessages.push(msg);
        }
        setMessages(newMessages);
        messagesRef.current = newMessages;
        scrollToBottom();
        return newMessages;
      },
      [scrollToBottom],
    );

    const removeMessage = useCallback((msg: Partial<TMessage>) => {
      const newMessages = messagesRef.current.filter((m) => m.id !== msg.id);
      setMessages(newMessages);
      messagesRef.current = newMessages;
    }, []);

    const getMessage = useCallback((id: string) => {
      return messagesRef.current.find((m) => m.id === id);
    }, []);

    const getMessages = useCallback(() => {
      return [...messagesRef.current];
    }, []);

    const removeAllMessages = useCallback(() => {
      setMessages([]);
      messagesRef.current = [];
    }, []);

    const setLoading = useCallback((val: boolean) => {
      setLoadingState(val);
    }, []);

    const setDisabled = useCallback((val: boolean) => {
      setDisabledState(val);
    }, []);

    const reload = useCallback(() => {
      setReloadKey((k) => k + 1);
    }, []);

    const onInputConfig =
      typeof onInput === 'function'
        ? { onSubmit: onInput }
        : onInput || { onSubmit: () => {} };

    const handleSubmit = useCallback(() => {
      const trimmed = inputValue.trim();
      if (!trimmed || loading || disabled) return;
      const fileLists = onUpload?.map((_, i) => fileListMap[i] || []);
      onInputConfig.onSubmit({ query: trimmed, fileList: fileLists });
      setInputValue('');
      setFileListMap({});
    }, [inputValue, loading, disabled, onInputConfig, fileListMap, onUpload]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      },
      [handleSubmit],
    );

    useImperativeHandle(ref, () => ({
      updateMessage,
      removeMessage,
      getMessage,
      getMessages,
      removeAllMessages,
      setLoading,
      setDisabled,
      scrollToBottom,
      reload,
      onInput: onInputConfig,
    }));

    const renderCards = (msg: TMessage) => {
      if (!msg.cards?.length) return null;
      return msg.cards.map((card, i) => {
        if (card.code === 'Footer') {
          return (
            <div key={`footer-${i}`} className={styles['message-footer']}>
              {card.data.left}
              {card.data.right}
            </div>
          );
        }
        if (card.code === 'Text') {
          const TextComp = cardConfig['Text'];
          if (TextComp) return <TextComp key={`text-${i}`} data={card.data} />;
          if (card.data?.content) {
            return (
              <div key={`text-${i}`} className="whitespace-pre-wrap">
                {card.data.content}
              </div>
            );
          }
          return null;
        }
        const CardComp = cardConfig[card.code];
        if (CardComp) {
          return (
            <CardComp
              key={`${card.code}-${i}`}
              data={card.data}
              context={{ onInput: onInputConfig }}
            />
          );
        }
        return null;
      });
    };

    const renderMessage = (msg: TMessage) => {
      if (msg.role === 'user') {
        return (
          <div key={msg.id} className={`${styles['message-item']} ${styles['message-user']}`}>
            <div className={styles['message-bubble']}>
              {msg.content}
              {renderCards(msg)}
            </div>
          </div>
        );
      }
      return (
        <div key={msg.id} className={`${styles['message-item']} ${styles['message-assistant']}`}>
          <div className={styles['message-content']}>
            {renderCards(msg)}
            {!msg.cards?.length && msg.content && (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div
        className={styles['chat-container']}
        style={{ background: uiConfig?.background || 'transparent' }}
      >
        <div ref={listRef} className={styles['message-list']}>
          {messages.length === 0 && uiConfig?.welcome && (
            <div key={`welcome-${reloadKey}`}>{uiConfig.welcome}</div>
          )}
          {messages.map(renderMessage)}
        </div>

        {loading && onStop && (
          <div className={styles['stop-btn-wrapper']}>
            <Button
              shape="round"
              icon={<IconRecordStop />}
              onClick={onStop}
              size="small"
            >
              停止
            </Button>
          </div>
        )}

        <div className={styles['input-area']}>
          {onUpload?.map((uploadConfig, idx) => (
            <Upload
              key={idx}
              multiple={uploadConfig.multiple}
              accept={uploadConfig.accept}
              customRequest={uploadConfig.customRequest}
              limit={uploadConfig.maxCount}
              showUploadList={false}
              onChange={(fileList) => {
                setFileListMap((prev) => ({ ...prev, [idx]: fileList }));
              }}
            >
              {uploadConfig.icon}
            </Upload>
          ))}
          <TextArea
            value={inputValue}
            onChange={setInputValue}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={disabled}
            autoSize={{ minRows: 1, maxRows: 4 }}
            maxLength={
              typeof onInput === 'object' ? onInput.maxLength : undefined
            }
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<IconSend />}
            onClick={handleSubmit}
            disabled={!inputValue.trim() || loading || disabled}
          />
        </div>
      </div>
    );
  },
);

ChatAnywhere.displayName = 'ChatAnywhere';

export default ChatAnywhere;
