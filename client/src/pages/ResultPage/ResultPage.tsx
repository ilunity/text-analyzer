import React, { useRef } from 'react';
import { ResultPageProps } from './ResultPage.types';
import { Button, Flex, Layout, Space, Typography } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { TagsTable } from '../../components/TagsTable';
import { PieChart } from '../../components/PieChart';
import { ChartDownloadRef } from '../../components/PieChart/PieChart.types.ts';
import { useGoToUpload } from '../../utils/use-go-to-upload.ts';
import { EmptyResult } from '../../components/EmptyResult';
import './ResultPage.css';

export const ResultPage: React.FC<ResultPageProps> = ({ tags }) => {
  const chartRef = useRef<ChartDownloadRef>(null);
  const goToUpload = useGoToUpload();

  const isEmptyResult = tags.length === 0;

  return (
    <Flex
      vertical
      style={ {
        minHeight: '100%',
        width: '100%',
        padding: '60px 80px 0px',
      } }
      justify={ 'flex-start' }
      align={ 'flex-start' }
    >
      <Layout.Content>
        <Typography.Title level={ 1 }>Результаты подбора тегов.</Typography.Title>
      </Layout.Content>
      <Space style={ { marginBottom: 40 } }>
        <Button size={ 'large' } icon={ <ArrowLeftOutlined /> } onClick={ goToUpload }>
          Вернуться к выбору документа
        </Button>
        { !isEmptyResult &&
          <Button
            size={ 'large' }
            type={ 'primary' }
            icon={ <UploadOutlined /> }
            onClick={ () => {
              chartRef.current?.download();
            } }
          >
            Сохранить диаграмму
          </Button>
        }
      </Space>
      { isEmptyResult
        ? <EmptyResult />
        : <Flex className={ 'result-wrapper' } gap={ 70 }>
          <TagsTable tags={ tags } />
          <PieChart ref={ chartRef } data={ tags } />
        </Flex>
      }
    </Flex>
  );
};
