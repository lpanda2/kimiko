/* Contains the code used to initalize patient data in the app */

import { getToken } from '../auth';
import {
    baseUri,
    getAllPages,
    storeCurrentPatient,
    storeClaims,
    storeUpdatedClaimsPerMonth
} from './setPatientDataHooks';

// fetch patient data
export const fetchPatientBenefits = async () => {

    const token = getToken();

    // Select data out of all the pages gotten.
    const data = await getAllPages(baseUri(token), token);
    storeCurrentPatient(data);
    storeClaims(data);

    // group data by month, type, sum cost
    const reducer = (acc, val) => {
        // TODO: convert date to moments and use that to get month
        let key = val['resource']['billablePeriod']['end'].slice(0,7);
        let claimType = val['resource']['type']['coding'].filter(i => i['system'].includes('eob'))[0]['code'];
        if (!acc[key]) {
            acc[key] = {}
        }
        if (!acc[key][claimType]){
            acc[key][claimType] = 0
        }
        acc[key][claimType] += val['resource']['payment']['amount']['value'];
        return acc
    }
     
    var res = data.reduce(reducer, {});
    var res = Object.keys(res)
                    .map(k => {return {date: k, ...res[k]}})
                    .sort((a, b) => (a.date > b.date) ? 1 : -1);
    storeUpdatedClaimsPerMonth(data, res);
};

