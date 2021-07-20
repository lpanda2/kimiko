import { credentials } from "./serverauth";

const remoteUrls = {
    'eob' : credentials.auth.tokenHost + '/v1/fhir/ExplanationOfBenefit',
    'patient' : credentials.auth.tokenHost + '/v1/fhir/Patient',
    'coverage' : credentials.auth.tokenHost + '/v1/fhir/Coverage',
    'register' : credentials.auth.tokenHost + '/v1/o/applications/register/',
    'sandbox' : credentials.auth.tokenHost,
    'tokens' : credentials.auth.tokenHost + '/v1/o/authorized_tokens/'
};

const server = {
    authorizationEndpoint: 
    `${credentials.auth.tokenHost}${credentials.auth.authorizePath}` +
        '?response_type=code' +
        `&client_id=${credentials.client.id}` + 
        '&scope=patient/ExplanationOfBenefit.read' + 
        `&redirect_uri=${credentials.app.redirectPath}`,
    profileEndpoint: "https://oauth2.server/api/profile"
}

const storeToken = (obj) => {
    localStorage.setItem('token', JSON.stringify(obj));
    setTimeout(() => {
        const refreshToken = obj.refresh_token;
        const updated = {...obj, access_token: refreshToken};
        localStorage.setItem('token', JSON.stringify(updated));
    }, obj.expires_in * 1000);

    setTimeout(() => {
        localStorage.removeItem('token');
        initiateAuthFlow();
    }, obj.expires_in * 1000 + obj.expires_in * 1000);
}

const storeCode = (code) => {
    localStorage.setItem('authorization_code', code);
}

export const getToken = () => {
    const output = localStorage.getItem('token');
    return output ? JSON.parse(output) : false;
}

const getCode = () => {
    return localStorage.getItem('authorization_code');
}


// AUTH FUNCTION
export default function initiateAuthFlow() {

    // first parse the uri
    const uriData = {};
    if (window.location.pathname === '/index.html') {
        window.location.search.substr(1)
            .split("&")
            .forEach(
                function (item) {
                    uriData[item.split("=")[0]] = item.split("=")[1]
                });
    };

    // store the code if it's in the uri
    localStorage.removeItem('authorization_code');
    if (uriData.code){
        storeCode(uriData.code);
    };

    const token = getToken();
    const code = getCode();

    const fetchCodeConditions = !token && !code;
    const fetchTokenConditions = !token && code;

    // if the token and code aren't there fetch code from user
    if (fetchCodeConditions) {
        window.location.href = server.authorizationEndpoint; // go to website

    // get the token with the code
    } else if (fetchTokenConditions){
        fetch(`${credentials.auth.tokenHost}${credentials.auth.tokenPath}/`, {
	        method: 'POST',
            body: 
                `client_id=${credentials.client.id}` +
                `&code=${code}` +
                '&grant_type=authorization_code' +
                `&client_secret=${credentials.client.secret}` +
                `&redirect_uri=${credentials.app.redirectPath}`,
	        headers: {
		        'Content-Type': 'application/x-www-form-urlencoded'
	        }
        })
        .then(resp => {return resp.json()})
        .then(data => {
            // log the token to the token object
            if (!data.error) {
                storeToken(data);
            }
            else {
                throw data.error;
            }})
        .catch(err => console.log(err));
        // delete code
        localStorage.removeItem('authorization_code');
    }
};

