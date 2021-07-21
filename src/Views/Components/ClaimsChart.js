import React from 'react';
import { Card, Col, Typography } from 'antd';
import { ClaimSpendStackedBarChart } from './ClaimSpendStackedBarChart.js'

export const ClaimsChart = ({ claims }) => (
    <Card bordered >
      <div style={{ minHeight: "400px" }}>
        <ClaimSpendStackedBarChart data={claims} />
      </div>
    </Card>
)
