import React from 'react';
import { UploadFilePageProps } from './UploadFilePage.types';
import { Button, Form } from 'antd';
import { UploadFile } from '../../components/UploadFile';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { CenterWrapper } from '../../components/CenterWrapper';
import { APP_PAGES, useCurrentPageContext } from '../../components/CurrentPageContextProvider/context.ts';
import { AnalyseTextRequest } from './analyse-text-request.ts';

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

    const analyseTextRequest = new AnalyseTextRequest(setPagePayload);
    await analyseTextRequest.execute(file);
  };

  return (
    <CenterWrapper>
      <Form
        name="upload-file"
        onFinish={ onFinish }
        style={ { width: 395 } }
        form={ form }
        initialValues={ {
          fileList: [],
        } }
      >
        <Form.Item<FieldType> name="fileList" noStyle>
          <UploadFile />
        </Form.Item>
        <Form.Item<FieldType> style={ { width: '100%', marginTop: hasLoaded ? 4 : 34 } }>
          <Button block type="primary" htmlType="submit" disabled={ !hasLoaded }>
            Продолжить
          </Button>
        </Form.Item>
      </Form>
    </CenterWrapper>
  );
};
