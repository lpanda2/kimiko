/* Contains the code used to initalize patient data in the app */

import { getToken } from '../auth';
import {
    getAllPages,
    storeCurrentPatient,
    storeClaims,
    storeUpdatedClaimsPerMonth
} from './hooks';

// basics
const baseUri = `${remoteUrls.eob}?patient=${token.patient}&type=carrier,inpatient,dme,hha,outpatient,snf`;
const fetchParams = {
    method: 'GET',
    headers: {
        'Authorization': `${token.token_type} ${token.access_token}`,
	'Content-Type': 'application/x-www-form-urlencoded'
    }};
const checkStatus = res => res.ok ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));
const parseJSON = response => response.json();


// fetch patient data
export const fetchPatientBenefits = async () => {

    const token = getToken();

    // Get a single endpoint.
    const getPage = url => fetch(url, fetchParams)
    .then(checkStatus)
    .then(parseJSON)
    .catch(error => console.log("There was a problem!", error));

    // Select data out of all the pages gotten.
    const data = await getAllPages(baseUri);
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

