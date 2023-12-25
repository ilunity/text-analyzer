import React from 'react';
import { TagsTableProps } from './TagsTable.types';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  value: number;
}

export const TagsTable: React.FC<TagsTableProps> = ({ tags }) => {
  const columns: ColumnsType<DataType> = [
    {
      // key: 'name',
      dataIndex: 'name',
      title: 'Тег',
    },
    {
      // key: 'value',
      dataIndex: 'value',
      title: 'Оценка',
    },
  ];

  const data: DataType[] = tags.map((value, index) => ({ key: `${index}`, ...value }));

  return (
    <Table style={ { width: 510 } } size={ 'small' } columns={ columns } dataSource={ data } pagination={ false } />
  );
};
