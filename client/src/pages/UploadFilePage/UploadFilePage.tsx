import React from 'react';
import { UploadFilePageProps } from './UploadFilePage.types';
import { Button, Form } from 'antd';
import { UploadFile } from '../../components/UploadFile';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { api } from '../../utils/api.ts';
import { CenterWrapper } from '../../components/CenterWrapper';
import { executeRequest } from '../../utils/execute-request.ts';
import { APP_PAGES, useCurrentPageContext } from '../../components/CurrentPageContextProvider/context.ts';
import { convertTagsType } from '../../utils/convert-tags-type.ts';

type FieldType = {
  fileList: UploadChangeParam['file'][];
};

export const UploadFilePage: React.FC<UploadFilePageProps> = () => {
  const [form] = Form.useForm<FieldType>();
  const loadedFiles = Form.useWatch('fileList', form);
  const hasLoaded = Array.isArray(loadedFiles) && loadedFiles.length > 0;
  const { setPagePayload } = useCurrentPageContext();

  const onFinish = async (values: FieldType) => {
    const file = values.fileList[0].originFileObj as RcFile;
    setPagePayload({ page: APP_PAGES.LOADING, data: null });

    const { success, data: id, error, status } = await executeRequest(() => api.analyseText(file));

    if (!success) {
      setPagePayload({
        page: APP_PAGES.ERROR,
        data: { status, message: error },
      });
    }

    const interval = setInterval(async () => {
      const { success, data, error, status } = await executeRequest(() => api.getAnalyseResult(id as string));

      if (status === 202) {
        return;
      }

      if (success) {
        setPagePayload({
          page: APP_PAGES.RESULT,
          data: status === 204 ? [] : convertTagsType(data),
        });
      } else {
        setPagePayload({
          page: APP_PAGES.ERROR,
          data: { status, message: error },
        });
      }

      clearInterval(interval);
    }, 3000);
  };

  return (
    <CenterWrapper>
      <Form
        name="upload-file"
        onFinish={onFinish}
        style={{ width: 395 }}
        form={form}
        initialValues={{
          fileList: [],
        }}
      >
        <Form.Item<FieldType> name="fileList" noStyle>
          <UploadFile />
        </Form.Item>
        <Form.Item<FieldType> style={{ width: '100%', marginTop: hasLoaded ? 4 : 34 }}>
          <Button block type="primary" htmlType="submit" disabled={!hasLoaded}>
            Продолжить
          </Button>
        </Form.Item>
      </Form>
    </CenterWrapper>
  );
};
