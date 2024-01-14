import React from 'react';
import { ErrorPageProps } from './ErrorPage.types';
import { Button, Result, ResultProps } from 'antd';
import { CenterWrapper } from '../../components/CenterWrapper';
import { useGoToUpload } from '../../utils/use-go-to-upload.ts';


export const ErrorPage: React.FC<ErrorPageProps> = ({ status, message }) => {
  const ResultStatuses = [403, 404, 500];
  const goToUpload = useGoToUpload();

  return (
    <CenterWrapper>
      <Result
        status={ ResultStatuses.includes(status) ? status as ResultProps['status'] : 'error' }
        title={ status }
        subTitle={ message || 'Что-то пошло не так.' }
        extra={
          <Button
            type="primary"
            onClick={ goToUpload }
          >
            Вернуться к выбору документа
          </Button>
        }
      />
    </CenterWrapper>
  );
};
