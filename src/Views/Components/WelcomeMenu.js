import React from 'react';
import { Card, Col, Typography } from 'antd';
const { Title, Text } = Typography;

export const WelcomeMenu = () => (
    <Col span={24}>
      <Card bordered>
        <Title level={3}>Welcome to Kimiko</Title>
        <Text>View your medical claims history.</Text>
      </Card>
    </Col>
);

