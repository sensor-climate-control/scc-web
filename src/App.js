import './App.css';
import Header from './features/application/Header'

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  return (
    <div className="App">
      <Header page_name='View Your Home' user_first_name='Daniel'/>
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
