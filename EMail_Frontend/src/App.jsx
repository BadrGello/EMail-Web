import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './components/SignUp';
import Login from './components/Login.jsx';
import EmailPage from './components/EmailPage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home/*" element={<EmailPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App
