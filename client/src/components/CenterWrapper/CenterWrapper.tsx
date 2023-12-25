import React from 'react';
import { CenterWrapperProps } from './CenterWrapper.types';
import { Flex } from 'antd';

export const CenterWrapper: React.FC<CenterWrapperProps> = ({ children }) => {
  return (
    <Flex
      justify={ 'center' }
      align={ 'center' }
      style={ {
        minHeight: '100vh',
      } }
    >
      { children }
    </Flex>
  );
};
