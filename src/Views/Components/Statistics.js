import React from 'react';
import { Card, Statistic } from 'antd';
import {
    FolderTwoTone,
    DollarTwoTone,
    MedicineBoxTwoTone,
    BugTwoTone,
} from "@ant-design/icons"

import { numberFormat } from './utilities.js';

// TODO: configure these instead

export const ClaimsStatistic = ({ value }) => (
    <Card bordered>
      <Statistic
        title="# of Claims"
        value={value}
        prefix={<FolderTwoTone twoToneColor="#F63E4F" />}
      />
    </Card>
);

export const CostStatistic = ({ value }) => (
    <Card bordered>
      <Statistic
        title="Total Spend"
        value={numberFormat(value)}
        prefix={<DollarTwoTone twoToneColor="#27C7FF" />}
      />
    </Card>
);

export const ServiceStatistic = ({ value }) => (
    <Card bordered>
      <Statistic
        title="Top Service"
        value={value}
        prefix={<MedicineBoxTwoTone twoToneColor="#F63848" />}
      />
    </Card>
);

export const BugFixStatistic = ({ value }) => (
    <Card bordered>
      <Statistic
        title="Top Diagnosis"
        value={value}
        prefix={<BugTwoTone twoToneColor="#117EFF" />}
      />
    </Card>
);
