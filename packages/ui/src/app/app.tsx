import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import Footer from './Footer';


const Main: FunctionComponent<void> = () => 
  <div>
    Welcome, this is the generated root page.
  </div>;

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between
  align-items: stretch;
`;

const StyledMain = styled(Main)`
  margin: 12px auto;
`

const StyledFooter = styled(Footer)`
  margin: 12px auto;
`

export function App() {
  return (
    <StyledApp>
      <Route path="/" render={()=> <StyledMain />} />
      <StyledFooter/>
    </StyledApp>
  );
}

export default App;
