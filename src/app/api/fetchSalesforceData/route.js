// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('API route: Received request'); // Start of API route
    try {
        const apiUrl = process.env.SF_AUTH_URL;
        const dataUrl = process.env.SF_DATA_URL;
        const trendDataUrl = process.env.SF_TREND_DATA_URL;

        // Get Salesforce Access Token
        const auth = await fetch(apiUrl);
        const authData = await auth.json();

        console.log('auth call data: ' + authData.access_token);
        console.log('auth call: ' + auth.status);

        // Handle response errors
        if (!auth.ok) {
            // Log error details if the response is not successful
            console.error('Error: API call failed');
            console.error('Status:', res.status);
            console.error('Status Text:', res.statusText);

            // You can also log the response body if you need to inspect it (useful for debugging)
            const errorData = await res.json();
            console.error('Error Data:', errorData);

            throw new Error(`API call failed with status ${res.status}`);
        }
        
        // Retrieve Financial Data
        const res = await fetch(dataUrl, {
            headers: {
            Authorization: `Bearer ${authData.access_token}`,
            },
        })

        // Handle response errors
        if (!res.ok) {
            // Log error details if the response is not successful
            console.error('Error: API call failed');
            console.error('Status:', res.status);
            console.error('Status Text:', res.statusText);

            // You can also log the response body if you need to inspect it (useful for debugging)
            const errorData = await res.json();
            console.error('Error Data:', errorData);

            throw new Error(`API call failed with status ${res.status}`);
        }

        const resData = await res.json();

        const formattedData_GDP = [["Date", "GDP Predictions ($T)", "GDP Actual ($T)"]];
        const formattedData_CPI = [["Date", "CPI Predictions ($)", "CPI Actual ($)"]];
        const formattedData_Unemployment = [["Date", "Unemployment Predictions (#)", "Unemployment Actual (#)"]];
        const formattedData_InterestRates = [["Date", "Interest Rates Predictions (%)", "Interest Rates Actual (%)"]];

        //console.log('response... ' + JSON.stringify(resData));
        console.log(resData.records.length);

        //collect and organize all data for the front-end to show
        for(var x=0; x<resData.records.length;x++){
            const record = resData.records[x];
            if(record.Type__c == 'CPI'){
                //formattedData_CPI.push([new Date(record.Date__c), record.Value__c]);
                if(record.RecordType.Name == 'Prediction'){
                    //if the previous ticket was active, add a connecting data point first
                    if(x - 1 > 0){
                        if(resData.records[x - 1].RecordType.Name != 'Prediction'){
                            const previousRecord = resData.records[x - 1];
                            formattedData_CPI.push([record.Date__c, record.Value__c, record.Value__c]);
                            continue;
                        }
                    }

                    //i am flipping these null values, such that the prediction and actual data shows as
                    //separate lines on the final client-side chart
                    formattedData_CPI.push([record.Date__c, record.Value__c, null]);
                }else{
                    formattedData_CPI.push([record.Date__c, null, record.Value__c]);
                    //if the previous ticket was active, add a connecting data point
                }
            }else if(record.Type__c == 'GDP'){
                console.log('record type name: ' + record.RecordType.Name);
                    if(record.RecordType.Name == 'Prediction'){
                        //if the previous ticket was active, add a connecting data point first
                        if(x - 1 > 0){
                            if(resData.records[x - 1].RecordType.Name != 'Prediction'){
                                const previousRecord = resData.records[x - 1];
                                formattedData_GDP.push([record.Date__c, record.Value__c, record.Value__c]);
                                continue;
                            }
                        }

                        //i am flipping these null values, such that the prediction and actual data shows as
                        //separate lines on the final client-side chart
                        formattedData_GDP.push([record.Date__c, record.Value__c, null]);
                    }else{
                        formattedData_GDP.push([record.Date__c, null, record.Value__c]);
                        //if the previous ticket was active, add a connecting data point
                    }
            }
            else if(record.Type__c == 'Interest Rate'){
                //formattedData_InterestRates.push([record.Date__c, record.Value__c]);
                if(record.RecordType.Name == 'Prediction'){
                    //if the previous ticket was active, add a connecting data point first
                    if(x - 1 > 0){
                        if(resData.records[x - 1].RecordType.Name != 'Prediction'){
                            const previousRecord = resData.records[x - 1];
                            formattedData_InterestRates.push([record.Date__c, record.Value__c, record.Value__c]);
                            continue;
                        }
                    }

                    //i am flipping these null values, such that the prediction and actual data shows as
                    //separate lines on the final client-side chart
                    formattedData_InterestRates.push([record.Date__c, record.Value__c, null]);
                }else{
                    formattedData_InterestRates.push([record.Date__c, null, record.Value__c]);
                    //if the previous ticket was active, add a connecting data point
                }
            }
            else if(record.Type__c == 'Unemployment'){
                //  formattedData_Unemployment.push([record.Date__c, record.Value__c]);
                if(record.RecordType.Name == 'Prediction'){
                    //if the previous ticket was active, add a connecting data point first
                    if(x - 1 > 0){
                        if(resData.records[x - 1].RecordType.Name != 'Prediction'){
                            const previousRecord = resData.records[x - 1];
                            formattedData_Unemployment.push([record.Date__c, record.Value__c, record.Value__c]);
                            continue;
                        }
                    }

                    //i am flipping these null values, such that the prediction and actual data shows as
                    //separate lines on the final client-side chart
                    formattedData_Unemployment.push([record.Date__c, record.Value__c, null]);
                }else{
                    formattedData_Unemployment.push([record.Date__c, null, record.Value__c]);
                    //if the previous ticket was active, add a connecting data point
                }
            }
        }

        console.log('data.length: ' + formattedData_GDP.length);

        // Retrieve Trend Data
        const trends = await fetch(trendDataUrl, {
            headers: {
            Authorization: `Bearer ${authData.access_token}`,
            },
        })

        // Handle response errors
        if (!trends.ok) {
            // Log error details if the response is not successful
            console.error('Error: API call failed');
            console.error('Status:', trends.status);
            console.error('Status Text:', trends.statusText);

            // You can also log the response body if you need to inspect it (useful for debugging)
            const errorData = await trends.json();
            console.error('Error Data:', errorData);

            throw new Error(`API call failed with status ${trends.status}`);
        }

        const trendData = await trends.json();

        var gdpTrend = "0";
        var unemploymentTrend = "0";
        var interestRateTrend = "0";
        var cpiTrend = "0";

        for(var x=0; x<trendData.records.length;x++){
            const record = trendData.records[x];
            if(record.Type__c == 'GDP'){
                gdpTrend = record.Value__c;
            }else if(record.Type__c == 'CPI'){
                cpiTrend = record.Value__c;
            }else if(record.Type__c == 'Interest Rate'){
                interestRateTrend = record.Value__c;
            }else if(record.Type__c == 'Unemployment'){
                unemploymentTrend = record.Value__c;
            }
        }

        //return response
        return NextResponse.json({
            gdp: formattedData_GDP,
            interest_rates: formattedData_InterestRates,
            unemployment_data: formattedData_Unemployment,
            cpi: formattedData_CPI,
            gdpTrend: gdpTrend,
            interestRateTrend: interestRateTrend,
            unemploymentTrend: unemploymentTrend,
            cpiTrend: cpiTrend
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
