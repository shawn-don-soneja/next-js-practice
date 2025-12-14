import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function StrategySelection() {
  return (
    <DropdownButton id="dropdown-item-button" title="Strategy">
      <Dropdown.ItemText><b>Select Strategy below:</b></Dropdown.ItemText>
      <Dropdown.Item as="button">Manager</Dropdown.Item>
      <Dropdown.Item as="button">Another action</Dropdown.Item>
      <Dropdown.Item as="button">Something else</Dropdown.Item>
    </DropdownButton>
  );
}

export default StrategySelection;