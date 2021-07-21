// TODO: swap to using firebase
import { remoteUrls } from '../auth.js'

export const storeCurrentPatient = (obj) => {
    let patientId = obj[0]['resource']['patient']['reference'];
    localStorage.setItem('currentPatient', patientId);
};

export const getCurrentPatient = () => {
    return localStorage.getItem('currentPatient');
};

export const storeUpdatedClaimsPerMonth = (data, obj) => {
    let patientId = data[0]['resource']['patient']['reference'] + '::' + 'upd_claims_per_month';
    localStorage.setItem(patientId, JSON.stringify(obj));
};

export const storeClaims = (obj) => {
    let patientId = obj[0]['resource']['patient']['reference'] + '::' + 'all_claims';
    localStorage.setItem(patientId, JSON.stringify(obj));
};

// basics
export const baseUri = (token) => {
 return `${remoteUrls.eob}?patient=${token.patient}&type=carrier,inpatient,dme,hha,outpatient,snf`
};

const fetchParams = (token) => {
    return {
    method: 'GET',
    headers: {
        'Authorization': `${token.token_type} ${token.access_token}`,
	'Content-Type': 'application/x-www-form-urlencoded'
    }}
};

const checkStatus = res => res.ok ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));
const parseJSON = response => response.json();

// get data from a single endpoint
const getPage = (url, token) => {
    return fetch(url, fetchParams(token))
        .then(checkStatus)
        .then(parseJSON)
        .catch(error => console.log("There was a problem!", error))
};

// query pagination
export const getAllPages = async (url, token, collection = []) => {
    const output = await getPage(url, token);
    const results = output.entry;
    collection = [...collection, ...results];
    const next = output.link.filter(link => link.relation === 'next');
    if (next.length != 0) {
        return getAllPages(next[0]['url'], token, collection);
    }
    return collection;
};

const removeKey = (key, {[key]: _, ...rest}) => rest;



// beginning of firestore/firebase 

/*
const storeClaimsPerMonth = (data, obj) => {
    let patientId = data[0]['resource']['patient']['reference'] + '::' + 'claims_per_month';
    localStorage.setItem(patientId, JSON.stringify(obj));
};

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

const storePatientClaims = async (obj) => {
    let currentPatient = getCurrentPatient();
    let trackedPatients = await getPatients();
    let id = obj[0]['resource']['patient']['reference'];

    // are we tracking the patient?
    if (!trackedPatients.includes(patientId)){
        db.collection('trackedPatients').add({
            'patientId': id,
            'tracking': true
        })
        db.collection('claims').doc(id).add({
            patientId: id,
            claims: obj
        })
    } else {
        claimIds = new Set(obj.map(i => i['resource']['id']));
        existing = new Set(await getClaimsByPatient(id));
        if (difference(claimIds, existing)){
            db.collection('claims').doc(id).add({
                patientId: id,
                claims: obj
            });
        }
    }
}
*/
