import React, { useEffect, useRef } from 'react';
import { Button } from '@arco-design/web-react';
import { IconSettings, IconDelete } from '@arco-design/web-react/icon';
import { useChatContext } from '../contexts/ChatContext';
import { useConfigContext } from '../contexts/ConfigContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import styles from '../index.module.less';

const MessageArea: React.FC = () => {
  const { currentSession } = useChatContext();
  const { config, toggleDebugInfo } = useConfigContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (config.autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, config.autoScroll]);

  const handleClearChat = () => {
    if (currentSession && window.confirm('确定要清空当前对话吗？')) {
      // Clear messages in current session
      // This would need to be implemented in the context
    }
  };

  return (
    <>
      <div className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>
          {currentSession ? currentSession.title : '选择或创建一个对话'}
        </h3>
        <div className={styles.headerActions}>
          <Button
            type="text"
            icon={<IconSettings />}
            onClick={toggleDebugInfo}
            size="small"
            title="调试面板"
          />
          <Button
            type="text"
            icon={<IconDelete />}
            onClick={handleClearChat}
            size="small"
            title="清空对话"
            disabled={!currentSession || currentSession.messages.length === 0}
          />
        </div>
      </div>

      <div className={styles.messageContainer}>
        {currentSession ? (
          <>
            <MessageList messages={currentSession.messages} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
            color: '#999'
          }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>🤖</div>
            <div>欢迎使用 Agent Chat UI</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>请创建或选择一个对话开始聊天</div>
          </div>
        )}
      </div>

      {currentSession && (
        <div className={styles.inputArea}>
          <MessageInput />
        </div>
      )}
    </>
  );
};

export default MessageArea;
