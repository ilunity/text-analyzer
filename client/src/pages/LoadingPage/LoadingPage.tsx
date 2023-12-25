import React from 'react';
import {Flex, Spin, Typography} from "antd";
import {CenterWrapper} from "../../components/CenterWrapper";

export const LoadingPage: React.FC = () => {
    return (
        <CenterWrapper>
            <Flex vertical gap={ 24 }>
                <Typography.Title level={ 2 }>
                    Обработка текста...
                </Typography.Title>
                <Spin size="large"/>
            </Flex>
        </CenterWrapper>
    );
};
