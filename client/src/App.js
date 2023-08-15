import LogIn from "./Components/LogIn";
import SignUp from "./Components/SignUp";
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={SignUp} />
        <Route path="/Login" Component={LogIn} />
      </Routes>
    </div>
  );
}

export default App;
