import React from 'react';
import { Card, Col, Typography } from 'antd';

export const EmptyCard = () => (
    <Col xs={24} sm={24} md={12}>
      <Card bordered >
        <div style={{ minHeight: "400px" }}>

        </div>
      </Card>
    </Col>
)
