// Importing React and necessary hooks
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const DataTypeDescription = (props) => {
  const unemploymentDescription = "Unemployment represents the proportion of people in the labor force who are unemployed and actively looking for work.";
  const gdpDescription = "Gross Domestic Product (GDP) is the total value of all goods and services produced within a country over a specific time period. It's a key measure of economic health, with growth in GDP indicating economic expansion and declines signaling potential recession.";
  const interestRateDescription = "Interest rates are the percentage charged by lenders or earned by depositors for the use of money over a specific period. They are a key tool for monetary policy, influencing borrowing, spending, and investment in the economy."
  const cpiDescription = "Consumer Price Index (CPI) measures the average change over time in the prices paid by consumers for goods and services, making it a key indicator of inflation."

  if(props.dataType == "Unemployment")
    return unemploymentDescription

  if(props.dataType == "Interest Rate")
    return interestRateDescription

  if(props.dataType == "CPI")
    return cpiDescription
  
  return gdpDescription
}

const WhatToDoText = (props) => {
  const unemploymentNext = "When unemployment rises, governments can boost public spending, such as on infrastructure, to create jobs, or offer tax incentives to businesses for hiring. Individuals can focus on skill development or pivot to industries with higher demand. Expanding social safety nets, like unemployment benefits, can also help sustain affected workers during economic recovery.";
  const gdpNext = "When GDP is increasing, consider investing in growth sectors and inflation-resistant assets. Review any planned borrowing, as interest rates might rise, and focus on savings to preserve purchasing power. Businesses could take advantage of the growth to expand, while individuals should prepare for potential inflation and future economic cycles.";
  const interestRateNext = "When interest rates are rising, borrowing costs increase, which can slow economic growth. Consider reducing high-interest debt, locking in fixed-rate loans, and focusing on investments that perform well in higher-rate environments, like bonds with short durations. For businesses, higher rates mean higher financing costs, so efficient cash flow management becomes critical. For individuals, it’s wise to prioritize saving, as higher rates can increase returns on savings accounts and fixed-income investments."
  const cpiNext = "A rising CPI indicates increasing prices, while a declining CPI suggests deflation. When CPI is increasing, it reflects inflation, which can erode purchasing power. Consider investing in assets that typically hedge against inflation, such as real estate or commodities, and review your budget to account for rising costs. For businesses, higher inflation may increase input costs, necessitating price adjustments or cost-saving measures. Individuals should prioritize maintaining the real value of savings and income by focusing on inflation-protected financial instruments."

  if(props.dataType == "Unemployment")
    return unemploymentNext

  if(props.dataType == "Interest Rate")
    return interestRateNext

  if(props.dataType == "CPI")
    return cpiNext
  
  return gdpNext
}

const WhereDidThisComeFrom = (props) => {
  const unemploymentNext = <>Source: <a href='https://www.bls.gov/data/' target="_blank">Bureau of Labor Statistics (BLS)</a> <br/>Timeseries: https://api.bls.gov/publicAPI/v2/timeseries/data/LAUCN040010000000005</>;
  const gdpNext = "Came from BLS";
  const interestRateNext = "Need to check"
  const cpiNext = "Somewhere"
  

  if(props.dataType == "Unemployment")
    return unemploymentNext

  if(props.dataType == "Interest Rate")
    return interestRateNext

  if(props.dataType == "CPI")
    return cpiNext
  
  return gdpNext
}

// Defining the functional component
const CardInfo = (props) => {
  // Component logic goes here (if any)

  // If I want to default one line to be open, I can use this param, in the <Accordian /> Parent component: defaultActiveKey="0" 

  // Returning the JSX to render
  return (
    <Accordion flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>What does this mean?</Accordion.Header>
        <Accordion.Body>
          <DataTypeDescription dataType={props.dataType}/>
          <br/><br/>
          <WhatToDoText dataType={props.dataType}/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Where did this data come from?</Accordion.Header>
        <Accordion.Body>
          <WhereDidThisComeFrom dataType={props.dataType} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

// Exporting the component for use in other files
export default CardInfo;
