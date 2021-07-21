import React from 'react';

export const camelToTitle = (text) => {
    var result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const numberFormat = (number) => {
    return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
    }).format(number)
};

export const boldFormat = (row, c) => {
    return <div style={{fontWeight: 'bolder', padding: '1em'}}>
        {row[c]}
    </div>
};

export const getSum = (claims) => {
    return claims.map(row => row.claimTotalPayment)
        .reduce((acc, val) => acc + val, 0)
}

export const getTopService = (claims) => {
    const output = claims.map(row => row.serviceType);
    const arr = Array.from(new Set(output))
        .filter(x => !!x)
        .reduce((a, v) => {
            a[v] = a[v] ? a[v] + 1 : 1;
            return a;
        }, {});
    return [...Object.keys(arr)].sort((a,b) => arr[a] > arr[b])[0]
}

export const getTopDiagnosis = (claims) => {
    const output = claims.map(row => row.diagnosis);
    const arr = Array.from(new Set(output))
          .filter(x => !!x)
          .reduce((a, v) => {
              a[v] = a[v] ? a[v] + 1 : 1;
              return a;
          }, {})
    return [...Object.keys(arr)].sort((a,b) => arr[a] > arr[b])[0]
}
