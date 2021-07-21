export const getCurrentPatient = () => {
    var output = localStorage.getItem('currentPatient');
    return output;
};

const getClaimsPerMonth = () => {
    let currentPatient = getCurrentPatient() + '::claims_per_month';
    var output = localStorage.getItem(currentPatient);
    return output ? JSON.parse(output) : false;
};

export const getUpdClaimsPerMonth = () => {
    let currentPatient = getCurrentPatient() + '::upd_claims_per_month';
    var output = localStorage.getItem(currentPatient);
    return output ? JSON.parse(output) : false;
};

export const getClaims = () => {
    let currentPatient = getCurrentPatient() + '::all_claims';
    var output = localStorage.getItem(currentPatient);
    return output ? JSON.parse(output) : false;
};

const getCosts = (costs, claimType) => {
    switch (claimType) {
        case 'CARRIER':
            var lineTotalCost = costs.filter(i => i['category']['coding'][0]['code'].includes('line_nch_pmt_amt'))[0]['amount']['value'];
            var lineBenePaid = costs.filter(i => i['category']['coding'][0]['code'].includes('line_bene_ptb_ddctbl_amt'))[0]['amount']['value'];  
            var lineInsPaid = costs.filter(i => i['category']['coding'][0]['code'].includes('line_prvdr_pmt_amt'))[0]['amount']['value'];   
            return {'lineTotalCost': lineTotalCost, 'lineCostPaidByYou': lineBenePaid, 'lineCostPaidByInsurance': lineInsPaid}
        case 'OUTPATIENT':
            var lineTotalCost = costs.filter(i => i['category']['coding'][0]['code'].includes('rev_cntr_pmt_amt_amt'))[0]['amount']['value'];
            var lineBenePaid = costs.filter(i => i['category']['coding'][0]['code'].includes('rev_cntr_ptnt_rspnsblty_pm'))[0]['amount']['value'];  
            var lineInsPaid = costs.filter(i => i['category']['coding'][0]['code'].includes('rev_cntr_prvdr_pmt_amt'))[0]['amount']['value'];
            return {'lineTotalCost': lineTotalCost, 'lineCostPaidByYou': lineBenePaid, 'lineCostPaidByInsurance': lineInsPaid}
        default:
            return {'lineTotalCost': 0, 'lineCostPaidByYou': 0, 'lineCostPaidByInsurance': 0}
    }

}

const getServiceType = (li, claimType) => {
    switch (claimType){
        case 'CARRIER':
            var betos = li['extension'].filter(i => i['url'].includes('betos_cd'))[0]['valueCoding'];
            return {'serviceTypeCode': betos['code'], 'serviceType': betos['display']};
        case 'OUTPATIENT':
            var rev = li['revenue']['coding'][0];
            return {'serviceTypeCode': rev['code'], 'serviceType': rev['display']}
        case 'INPATIENT':
            var rev = li['revenue']['coding'][0];
            return {'serviceTypeCode': rev['code'], 'serviceType': rev['display']}
        default:
            return {'serviceTypeCode': null, 'serviceType': null};
    }
};

const getDiagnosis = (e, seq) => {
    const diags = e['resource']['diagnosis'].filter(i => i['sequence']);
    const diagnosis = diags.filter(i => i['sequence'] == seq)[0];
    if (diagnosis) {
        return diagnosis;
    }
    else {
        return null;
    }
};

const getProcedureCode = (li, claimType, seq, e) => {
    switch (claimType){
        case 'CARRIER':
            return li['service'] ? li['service']['coding'][0]['code']: null;
        case 'OUTPATIENT':
            return li['service'] ? li['service']['coding'][0]['code']: null;
        case 'INPATIENT':
            if (!e['resource']['procedure']){return null}
            var codes = e['resource']['procedure'].filter(i => i['sequence'] == seq)
            if (codes.length != 0){return codes[0]['procedureCodeableConcept']['coding'][0]['code']}
            else {return null}
        default:
            return ''
    }
};

export const makeClaimTableData = (claims) => {
    const cleanedClaims = claims.map(e => {
        const header = {
            // claimId: e['resource']['id'],
            claimType: e['resource']['type']['coding'].filter(i => i['system'].includes('eob'))[0]['code'],
            claimStart: e['resource']['billablePeriod']['start'],
            claimEnd: e['resource']['billablePeriod']['end'],
            claimTotalPayment: e['resource']['payment']['amount']['value'],
        };
        const lines = e['resource']['item'].map(li => {
            // service type is different for each claim type
            var serviceType = getServiceType(li, header['claimType']);
            // var diagnosis = e['resource']['diagnosis'][parseInt(li['sequence']) - 1];
            var diagnosis = getDiagnosis(e, parseInt(li['sequence']));
            var costs = li['adjudication'].filter(i => i['amount']);

            // adjudication is different for each claim type
            var lineCosts = getCosts(costs, header['claimType']);                   
            var lineMap = {
                ...header,
                sequence: li['sequence'],
                procedureCode: getProcedureCode(li, header['claimType'], li['sequence'], e),
                // quantity: li['quantity']['value'],
                serviceStart: li['servicedPeriod'] ? li['servicedPeriod']['start'] : null,
                // serviceEnd: li['servicedPeriod'] ? li['servicedPeriod']['end'] : null,
                ...serviceType
            }
            if (diagnosis && diagnosis['diagnosisCodeableConcept']['coding'][0]['display']) {
                diagnosis = diagnosis['diagnosisCodeableConcept']['coding'][0];
                var diagnosisRenamed = {'diagnosisCode': diagnosis['code'], 'diagnosis': diagnosis['display']};
            } else {
                var diagnosisRenamed = {'diagnosisCode': 'N/A', 'diagnosis': 'N/A'};
            }
            lineMap = {
                ...lineMap, 
                ...diagnosisRenamed,
                ...lineCosts
            }
            return lineMap;
        });
        return lines; 
    });
    return Array.from(new Set(cleanedClaims.flat(2)));
};
