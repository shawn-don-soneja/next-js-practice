// Importing React and necessary hooks
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const DataTypeDescription = () => {
  const gdpDescription = "Gross Domestic Product (GDP) is the total value of all goods and services produced within a country over a specific time period. It's a key measure of economic health, with growth in GDP indicating economic expansion and declines signaling potential recession.";
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

  // Returning the JSX to render
  return (
    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>What does this mean?</Accordion.Header>
        <Accordion.Body>
          <DataTypeDescription/>
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
