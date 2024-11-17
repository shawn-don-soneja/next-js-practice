// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('API route: Received request'); // Start of API route
    try {
        const apiUrl = process.env.SF_AUTH_URL;
        const dataUrl = process.env.SF_DATA_URL;

        // Make a secure call to the external API using the URL and API key from the environment
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
        
        // Make a secure call to the external API using the URL and API key from the environment
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

        const formattedData_GDP = [["Date", "GDP_Server", "Predictions"]];
        const formattedData_CPI = [["Date", "CPI", "Predictions"]];
        const formattedData_Unemployment = [["Date", "Unemployment", "Predictions"]];
        const formattedData_InterestRates = [["Date", "Interest Rates", "Predictions"]];

        //console.log('response... ' + JSON.stringify(resData));
        console.log(resData.records.length);

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

        return NextResponse.json({
            gdp: formattedData_GDP,
            //gdp_predictions: formattedData_GDP_predictions,
            interest_rates: formattedData_InterestRates,
            unemployment_data: formattedData_Unemployment,
            cpi: formattedData_CPI
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
