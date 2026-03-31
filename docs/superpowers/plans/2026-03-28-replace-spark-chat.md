# Replace @spark-ai/chat with Arco Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `@spark-ai/chat` dependency and replace it with a custom chat component built on Arco Design, keeping the same API surface to minimize business code changes.

**Architecture:** Create `packages/main/src/components/SparkChat/` with types, utility functions, and 3 UI components (ChatAnywhere, Accordion, DefaultCards). Business code only changes import paths.

**Tech Stack:** React 18, TypeScript, @arco-design/web-react, TailwindCSS, ahooks

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/SparkChat/index.ts` | Public exports (barrel file) |
| Create | `src/components/SparkChat/types.ts` | TMessage, ChatAnywhereRef, CardItem, AccordionProps types |
| Create | `src/components/SparkChat/utils.ts` | `createCard()`, `uuid()` |
| Create | `src/components/SparkChat/ChatAnywhere.tsx` | Main chat container with message list, input, upload, ref API |
| Create | `src/components/SparkChat/ChatAnywhere.module.less` | Chat container styles |
| Create | `src/components/SparkChat/Accordion.tsx` | Collapsible steps panel using Arco Collapse |
| Create | `src/components/SparkChat/DefaultCards.tsx` | FooterActions + FooterCount |
| Modify | `src/pages/App/AssistantAppEdit/components/SparkChat/index.tsx` | Change import path |
| Modify | `src/pages/App/AssistantAppEdit/components/SparkChat/converter.tsx` | Change import path |
| Modify | `src/pages/App/AssistantAppEdit/components/SparkChat/components/Steps/index.tsx` | Change import path |
| Modify | `src/pages/App/AssistantAppEdit/components/SparkChat/components/Welcome/index.tsx` | Change import path |
| Modify | `src/pages/App/Workflow/components/ChatTestPanel/index.tsx` | Change import path |
| Modify | `package.json` (root) | Remove `@spark-ai/chat` |

All paths are relative to `packages/main/`.

---

### Task 1: Types and Utilities

**Files:**
- Create: `packages/main/src/components/SparkChat/types.ts`
- Create: `packages/main/src/components/SparkChat/utils.ts`

- [ ] **Step 1: Create types.ts**

```typescript
// packages/main/src/components/SparkChat/types.ts
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
  [key: string]: any; // allow extra fields like usage, task_id
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
```

- [ ] **Step 2: Create utils.ts**

```typescript
// packages/main/src/components/SparkChat/utils.ts
import { CardItem } from './types';

let counter = 0;

export function uuid(): string {
  return `msg-${Date.now()}-${++counter}`;
}

export function createCard(code: string, data: any): CardItem {
  return { code, data };
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/main/src/components/SparkChat/types.ts packages/main/src/components/SparkChat/utils.ts
git commit -m "feat: add SparkChat types and utilities"
```

---

### Task 2: Accordion Component

**Files:**
- Create: `packages/main/src/components/SparkChat/Accordion.tsx`

- [ ] **Step 1: Create Accordion.tsx**

Uses Arco `Collapse` to render collapsible step items with status indicator.

```tsx
// packages/main/src/components/SparkChat/Accordion.tsx
import { Collapse, Spin } from '@arco-design/web-react';
import { IconCheck, IconClose, IconMinus } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { AccordionProps } from './types';

const StatusIcon = ({ status }: { status?: string }) => {
  if (status === 'finished') return <IconCheck style={{ color: 'var(--color-success-6)' }} />;
  if (status === 'generating') return <Spin size={14} />;
  if (status === 'interrupted') return <IconMinus style={{ color: 'var(--color-warning-6)' }} />;
  if (status === 'error') return <IconClose style={{ color: 'var(--color-danger-6)' }} />;
  return null;
};

export default function Accordion(props: AccordionProps) {
  const { title, status, steps = [], defaultOpen = false } = props;
  const [expanded, setExpanded] = useState(defaultOpen);

  if (!steps.length) return null;

  return (
    <div className="mb-[8px]">
      <div
        className="flex items-center gap-[6px] cursor-pointer py-[4px] text-[13px]"
        style={{ color: 'var(--color-text-2)' }}
        onClick={() => setExpanded(!expanded)}
      >
        <StatusIcon status={status} />
        <span>{title}</span>
        <span
          className="transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▸
        </span>
      </div>
      {expanded && (
        <Collapse bordered={false} defaultActiveKey={steps.map((_, i) => String(i))}>
          {steps.map((step, index) => (
            <Collapse.Item
              key={index}
              name={String(index)}
              header={
                <div className="flex items-center gap-[6px]">
                  {step.icon}
                  <span>{step.title}</span>
                </div>
              }
            >
              {step.children}
            </Collapse.Item>
          ))}
        </Collapse>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/main/src/components/SparkChat/Accordion.tsx
git commit -m "feat: add Accordion component for SparkChat"
```

---

### Task 3: DefaultCards Component

**Files:**
- Create: `packages/main/src/components/SparkChat/DefaultCards.tsx`

- [ ] **Step 1: Create DefaultCards.tsx**

`FooterActions` renders a row of icon buttons. `FooterCount` renders key-value stat pairs.

```tsx
// packages/main/src/components/SparkChat/DefaultCards.tsx
import { ReactNode } from 'react';

interface FooterAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function FooterActions({ data }: { data: FooterAction[] }) {
  return (
    <div className="flex items-center gap-[4px]">
      {data.map((action, i) => (
        <div
          key={i}
          className="cursor-pointer p-[4px] rounded-[4px] hover:bg-[var(--color-fill-2)] flex items-center gap-[4px]"
          onClick={action.onClick}
        >
          {action.icon}
          {action.label && (
            <span className="text-[12px]" style={{ color: 'var(--color-text-3)' }}>
              {action.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function FooterCount({ data }: { data: [string, number | undefined][] }) {
  return (
    <div className="flex items-center gap-[12px] text-[12px]" style={{ color: 'var(--color-text-3)' }}>
      {data.map(([label, value], i) => (
        <span key={i}>
          {label}: {value ?? '-'}
        </span>
      ))}
    </div>
  );
}

export const DefaultCards = {
  FooterActions,
  FooterCount,
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/main/src/components/SparkChat/DefaultCards.tsx
git commit -m "feat: add DefaultCards (FooterActions, FooterCount) for SparkChat"
```

---

### Task 4: ChatAnywhere Main Component

**Files:**
- Create: `packages/main/src/components/SparkChat/ChatAnywhere.tsx`
- Create: `packages/main/src/components/SparkChat/ChatAnywhere.module.less`

- [ ] **Step 1: Create ChatAnywhere.module.less**

```less
// packages/main/src/components/SparkChat/ChatAnywhere.module.less
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.message-item {
  margin-bottom: 16px;
}

.message-user {
  display: flex;
  justify-content: flex-end;

  .message-bubble {
    background: var(--color-primary-light-1);
    color: var(--color-text-1);
    border-radius: 12px 12px 2px 12px;
    padding: 10px 16px;
    max-width: 80%;
    word-break: break-word;
    white-space: pre-wrap;
  }
}

.message-assistant {
  display: flex;
  justify-content: flex-start;

  .message-content {
    max-width: 90%;
  }
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  min-height: 28px;
}

.input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.stop-btn-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
```

- [ ] **Step 2: Create ChatAnywhere.tsx**

Core chat container managing messages via `useImperativeHandle`, rendering message list with card system, and input area.

```tsx
// packages/main/src/components/SparkChat/ChatAnywhere.tsx
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

    // Keep messagesRef in sync
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

    // Build onInput object for ref
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

    // Render card for a message
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
          // Text cards are handled by cardConfig or rendered as markdown
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
        // Custom card from cardConfig
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
```

- [ ] **Step 3: Commit**

```bash
git add packages/main/src/components/SparkChat/ChatAnywhere.tsx packages/main/src/components/SparkChat/ChatAnywhere.module.less
git commit -m "feat: add ChatAnywhere main component"
```

---

### Task 5: Barrel Export File

**Files:**
- Create: `packages/main/src/components/SparkChat/index.ts`

- [ ] **Step 1: Create index.ts**

```typescript
// packages/main/src/components/SparkChat/index.ts
export type {
  TMessage,
  ChatAnywhereRef,
  ChatAnywhereProps,
  AccordionProps,
  AccordionStepItem,
  CardItem,
} from './types';
export { uuid, createCard } from './utils';
export { default as ChatAnywhere } from './ChatAnywhere';
export { default as Accordion } from './Accordion';
export { DefaultCards } from './DefaultCards';
```

- [ ] **Step 2: Commit**

```bash
git add packages/main/src/components/SparkChat/index.ts
git commit -m "feat: add SparkChat barrel export"
```

---

### Task 6: Update Business Code Imports

**Files:**
- Modify: `packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/index.tsx`
- Modify: `packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/converter.tsx`
- Modify: `packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/components/Steps/index.tsx`
- Modify: `packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/components/Welcome/index.tsx`
- Modify: `packages/main/src/pages/App/Workflow/components/ChatTestPanel/index.tsx`

- [ ] **Step 1: Update SparkChat/index.tsx**

Change line 2-9:
```typescript
// Before:
import {
  ChatAnywhere,
  ChatAnywhereRef,
  createCard,
  DefaultCards,
  TMessage,
  uuid,
} from '@spark-ai/chat';

// After:
import {
  ChatAnywhere,
  ChatAnywhereRef,
  createCard,
  DefaultCards,
  TMessage,
  uuid,
} from '@/components/SparkChat';
```

Also change `Tooltip` `title` prop to `content` on lines 285, 312, 341, 366 (these use `title=` which is Ant Design style — verify during implementation whether these already use `content` from the earlier Arco migration).

- [ ] **Step 2: Update converter.tsx**

Change line 2:
```typescript
// Before:
import { TMessage } from '@spark-ai/chat';

// After:
import { TMessage } from '@/components/SparkChat';
```

- [ ] **Step 3: Update Steps/index.tsx**

Change line 8:
```typescript
// Before:
import { Accordion, AccordionProps } from '@spark-ai/chat';

// After:
import { Accordion, AccordionProps } from '@/components/SparkChat';
```

Note: `AccordionProps` is used as the type name for `AccordionStepItem` in the Steps component. The `mergeToolCalls` function returns `AccordionStepItem[]` (items with `icon`, `title`, `children`). The imported `AccordionProps` in the original code is used as the step item type. Our `AccordionStepItem` type matches this usage. Update the import to:

```typescript
import { Accordion, AccordionStepItem as AccordionProps } from '@/components/SparkChat';
```

Or alternatively, add a type alias in our exports: `export type { AccordionStepItem as AccordionProps }` — this is cleaner. Do this: add `AccordionStepItem as AccordionProps` to the barrel export in `index.ts` so the business code doesn't need to change at all:

```typescript
// In index.ts, add:
export type { AccordionStepItem as AccordionProps } from './types';
```

Then the Steps import stays as:
```typescript
import { Accordion, AccordionProps } from '@/components/SparkChat';
```

- [ ] **Step 4: Update Welcome/index.tsx**

Change line 2:
```typescript
// Before:
import { ChatAnywhereRef } from '@spark-ai/chat';

// After:
import { ChatAnywhereRef } from '@/components/SparkChat';
```

- [ ] **Step 5: Update ChatTestPanel/index.tsx**

Change lines 8-15:
```typescript
// Before:
import {
  ChatAnywhere,
  ChatAnywhereRef,
  createCard,
  DefaultCards,
  TMessage,
  uuid,
} from '@spark-ai/chat';

// After:
import {
  ChatAnywhere,
  ChatAnywhereRef,
  createCard,
  DefaultCards,
  TMessage,
  uuid,
} from '@/components/SparkChat';
```

- [ ] **Step 6: Commit**

```bash
git add packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/index.tsx \
       packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/converter.tsx \
       packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/components/Steps/index.tsx \
       packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/components/Welcome/index.tsx \
       packages/main/src/pages/App/Workflow/components/ChatTestPanel/index.tsx
git commit -m "refactor: replace @spark-ai/chat imports with local SparkChat component"
```

---

### Task 7: Remove @spark-ai/chat Dependency

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Remove @spark-ai/chat from root package.json**

Remove this line from `dependencies`:
```json
"@spark-ai/chat": "^1.1.3",
```

- [ ] **Step 2: Run npm install to update lockfile**

```bash
npm install --ignore-scripts
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove @spark-ai/chat dependency"
```

---

### Task 8: Build and Verify

- [ ] **Step 1: Build spark-flow**

```bash
npm run build:flow
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Setup main**

```bash
npm run setup -w main
```

Expected: Umi setup completes without errors.

- [ ] **Step 3: Check for any remaining @spark-ai/chat references**

```bash
grep -r "@spark-ai/chat" packages/main/src/ --include="*.ts" --include="*.tsx"
```

Expected: No output (no remaining references).

- [ ] **Step 4: Start dev server and verify page loads**

```bash
cd packages/main && npm run dev
```

Expected: Dev server starts on port 8000 with no module resolution errors.
