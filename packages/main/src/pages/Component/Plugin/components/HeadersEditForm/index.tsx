import $i18n from '@/i18n';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
import { Form, Input } from '@arco-design/web-react';
import styles from './index.module.less';

export default function HeadersEditForm() {
  return (
    <div className={`flex flex-col gap-2 ${styles.form}`}>
      <div className={`flex gap-2 ${styles.label}`}>
        <div style={{ width: 300 }}>Key</div>
        <div style={{ width: 300 }}>Value</div>
      </div>
      <Form.List initialValue={[]} name={['config', 'headers']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              return (
                <div key={key} className="flex items-start gap-2">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    validateFirst
                    rules={[
                      {
                        required: true,
                        message: $i18n.get({
                          id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.parameterNameCannotBeEmpty',
                          dm: '参数名不可为空',
                        }),
                      },
                      {
                        message: $i18n.get({
                          id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.onlyLettersNumbersOrUnderscoresAndStartWithLetterOrUnderscore',
                          dm: '只能包含字母、数字或下划线，并且以字母或下划线开头',
                        }),

                        pattern: /^[a-zA-Z_][a-zA-Z0-9_-]*$/,
                      },
                    ]}
                  >
                    <Input
                      style={{ width: 300 }}
                      placeholder={$i18n.get({
                        id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.enterParameterName',
                        dm: '输入参数名',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[
                      {
                        required: true,
                        message: $i18n.get({
                          id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.parameterNameCannotBeEmpty',
                          dm: '参数名不可为空',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={$i18n.get({
                        id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.enterValue',
                        dm: '请输入Value',
                      })}
                      style={{ width: 300 }}
                    />
                  </Form.Item>
                  <IconButton
                    bordered={false}
                    onClick={() => remove(name)}
                    icon="spark-delete-line"
                  />
                </div>
              );
            })}

            <a className="flex align-center gap-1" onClick={() => add()}>
              <IconFont type="spark-plus-line" />
              {$i18n.get({
                id: 'main.pages.Component.Plugin.components.HeadersEditForm.index.addInputParameter',
                dm: '增加输入参数',
              })}
            </a>
          </>
        )}
      </Form.List>
    </div>
  );
}
