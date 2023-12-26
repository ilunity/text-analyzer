import React from 'react';
import { Typography } from 'antd';

export const EmptyResult: React.FC = () => {
  return (
    <Typography>
      Не удалось провести анализ текста. Попробуйте увеличить размер файла.
    </Typography>
  );
};
