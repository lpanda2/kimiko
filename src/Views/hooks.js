// TODO: swap to using firebase

const storeCurrentPatient = (obj) => {
    let patientId = obj[0]['resource']['patient']['reference'];
    localStorage.setItem('currentPatient', patientId);
};

const getCurrentPatient = () => {
    return localStorage.getItem('currentPatient');
};

const storeUpdatedClaimsPerMonth = (data, obj) => {
    let patientId = data[0]['resource']['patient']['reference'] + '::' + 'upd_claims_per_month';
    localStorage.setItem(patientId, JSON.stringify(obj));
};

const storeClaims = (obj) => {
    let patientId = obj[0]['resource']['patient']['reference'] + '::' + 'all_claims';
    localStorage.setItem(patientId, JSON.stringify(obj));
};

// query pagination
export const getAllPages = async (url, collection = []) => {
    const output = await getPage(url);
    const results = output.entry;
    collection = [...collection, ...results];
    const next = output.link.filter(link => link.relation === 'next');
    if (next.length != 0) {
        return getAllPages(next[0]['url'], collection);
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
