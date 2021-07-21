import React from 'react';
import { Card, Col, Typography, Table } from 'antd';
import {
    camelToTitle,
    numberFormat,
    boldFormat
} from './utilities.js';

const columnWidth = (c) => {
    const columnWidths = {
        'lineCostPaidByYou': 60,
        'lineCostPaidByInsurance': 60,
        'lineTotalCost': 60,
        'claimTotalPayment': 60,
        'claimStart': 100,
        'claimEnd': 100
    }
    return columnWidths[c] ? columnWidths[c]: 89;
}

const formatChooser = (column) => {
    if (column.includes('Cost') || column.includes('Payment')){
        return 'number'
    } else if (column.includes('Start') || column.includes('End')){
        return 'date'
    } else {
        return 'string'
    }
}

const sorter = (c) => {
    const config = {
        number: (a, b) => a[c] - b[c],
        string: (a, b) => a[c] > b[c],
        date: (a, b) => a[c] > b[c],
    }
    return config[c];
}


const columnGenerator = (columnNames, claims) => {
    return columnNames.map(c => {
        var colDetails = {
            key: c,
            title: camelToTitle(c),
            dataIndex: c,
            width: columnWidth(c)
        }

        // add sorting configuration
        if (c.includes('Cost') || c.includes('Payment')){
            colDetails['sorter'] = (a, b) => a[c] - b[c]
        } else if (c.includes('claimType') || c.includes('Start') || c.includes('End')){
            colDetails['sorter'] = (a, b) => a[c] > b[c]
            colDetails['defaultSortOrder'] = 'ascend'
        }

        // add filter configuration
        if (c.includes('claimType') || c === 'diagnosis' || c.includes('serviceType')){
            const values = Array.from(new Set(claims.map(row => row[c])));
            const filters = values.map(val => {
                return { text: val, value: val }
            })
            colDetails['filters'] = filters;
            colDetails['onFilter'] = (value, record) => record[c].indexOf(value) === 0
        }
        
        return colDetails;
    });
};


export const ClaimsTable = ({ claims }) => {
    if (claims.length == 0){
        return null;
    }
    return (
        <Card bordered>
          <Table
            size='small'
            dataSource={claims}
            columns={columnGenerator(Object.keys(claims[0]), claims)} 
            />
        </Card>
    )
}
