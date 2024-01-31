import { UserAuthContextProvider } from './UserAuthContext';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';


const App = () => {
  
  return (
    <>
    <UserAuthContextProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
      </Routes>
    </UserAuthContextProvider>
    </>
  );
}

export default App;
