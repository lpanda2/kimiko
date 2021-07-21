import React, { useState, useEffect } from 'react';
import initiateAuthFlow from '../auth.js'
import { fetchPatientBenefits } from './setPatientData.js'
import { Col, Row } from 'antd';

import {
    getUpdClaimsPerMonth,
    getClaims,
    makeClaimTableData
} from './getPatientData.js'
import {
    ClaimsStatistic,
    CostStatistic,
    ServiceStatistic,
    BugFixStatistic
} from './Components/Statistics.js'
import { WelcomeMenu } from './Components/WelcomeMenu.js'
import { ClaimsChart } from './Components/ClaimsChart.js'
import { ClaimsTable } from './Components/ClaimsTable.js'
import { EmptyCard } from './Components/EmptyCard.js'
import { getSum, getTopService, getTopDiagnosis } from './Components/utilities.js'

export default function Dashboard() {
    useEffect(() => {
        initiateAuthFlow();
    }, []);

    const [claims, setClaims] = useState([]);
    const [claimsPerMonth, setClaimsPerMonth] = useState([]);
    useEffect(() => {
        // fetchPatientBenefits()
        const perMonth = getUpdClaimsPerMonth();
        setClaimsPerMonth(perMonth);
        let allClaims = getClaims();
        allClaims = makeClaimTableData(allClaims)
        if (allClaims.length > 0){
            setClaims(allClaims)
        }
    }, []);

    return (
        <Row gutter={[16, 16]}>

          <WelcomeMenu />

          <Col xs={24} sm={24} md={6}>
            <ClaimsStatistic value={claims.length} />
          </Col>

          <Col xs={24} sm={24} md={6}>
            <CostStatistic value={getSum(claims)} />
          </Col>

          <Col xs={24} sm={24} md={6}>
            <ServiceStatistic value={getTopService(claims)} />
          </Col>

          <Col xs={24} sm={24} md={6}>
            <BugFixStatistic value={getTopDiagnosis(claims)} />
          </Col>

          <Col span={24}>
            <ClaimsChart claims={claimsPerMonth} />
          </Col>

          <Col span={24}>
              <ClaimsTable claims={claims} />
          </Col>

        </Row>
    )
}


/*
  <Col xs={24} sm={24} md={24}>
  <Row gutter={[16, 16]}>
  <EmptyCard />
  <EmptyCard />
  </Row>
  </Col>

*/
