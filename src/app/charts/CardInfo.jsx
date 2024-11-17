// Importing React and necessary hooks
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const DataTypeDescription = (props) => {
  const unemploymentDescription = "Unemployment represents the proportion of people in the labor force who are unemployed and actively looking for work.";
  const gdpDescription = "Gross Domestic Product (GDP) is the total value of all goods and services produced within a country over a specific time period. It's a key measure of economic health, with growth in GDP indicating economic expansion and declines signaling potential recession.";
  const interestRateDescription = "Interest rates are the percentage charged by lenders or earned by depositors for the use of money over a specific period. They are a key tool for monetary policy, influencing borrowing, spending, and investment in the economy. When interest rates are rising, borrowing costs increase, which can slow economic growth. Consider reducing high-interest debt, locking in fixed-rate loans, and focusing on investments that perform well in higher-rate environments, like bonds with short durations. For businesses, higher rates mean higher financing costs, so efficient cash flow management becomes critical. For individuals, it’s wise to prioritize saving, as higher rates can increase returns on savings accounts and fixed-income investments."
  const cpiDescription = "Consumer Price Index (CPI) measures the average change over time in the prices paid by consumers for goods and services, making it a key indicator of inflation. A rising CPI indicates increasing prices, while a declining CPI suggests deflation. When CPI is increasing, it reflects inflation, which can erode purchasing power. Consider investing in assets that typically hedge against inflation, such as real estate or commodities, and review your budget to account for rising costs. For businesses, higher inflation may increase input costs, necessitating price adjustments or cost-saving measures. Individuals should prioritize maintaining the real value of savings and income by focusing on inflation-protected financial instruments."



  if(props.dataType == "Unemployment")
    return unemploymentDescription

  if(props.dataType == "Interest Rate")
    return interestRateDescription

  if(props.dataType == "CPI")
    return cpiDescription
  
  return gdpDescription
}

const WhatToDoText = () => {
  // I could just return one long text, covering all increasing, stagnant, and decreasing... less code needed overall... less room to break...
  const gdpSuccess = "When GDP is increasing, consider investing in growth sectors and inflation-resistant assets. Review any planned borrowing, as interest rates might rise, and focus on savings to preserve purchasing power. Businesses could take advantage of the growth to expand, while individuals should prepare for potential inflation and future economic cycles.";


  return <div><br/>{gdpSuccess}</div>
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
          <WhatToDoText />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Where did this data come from?</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

// Exporting the component for use in other files
export default CardInfo;
