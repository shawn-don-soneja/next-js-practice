import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function StrategySelection() {
  return (<div>
    Strategy: 
    <DropdownButton id="dropdown-item-button" title="Base Agent">
      <Dropdown.ItemText><b>Select Strategy below:</b></Dropdown.ItemText>
      <Dropdown.Item as="button">Base Agent</Dropdown.Item>
      <Dropdown.Item as="button">Macro Agent</Dropdown.Item>
      <Dropdown.Item as="button">Penny Agent</Dropdown.Item>
    </DropdownButton>
  </div>
  );
}

export default StrategySelection;