import logo from './logo.svg';
import './App.css';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Error from './Error';
import ProtectedRoute from './ProtectedRoute';


function App() {
  return (
    <div>

      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/Scheduler" element={<ProtectedRoute><Home /> </ProtectedRoute>} />
            <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
            <Route path="/Error" element={<Error />} />
          </Routes>
        </main>
      </Router>

    </div>
  );
}

export default App;
