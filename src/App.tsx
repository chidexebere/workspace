import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthUserProvider } from './firebase/auth/context';
import NotFound from './pages/404';
import BoardDetails from './pages/boardDetails';
import Dashboard from './pages/dashboard';
import Home from './pages/home';

function App() {
  return (
    <AuthUserProvider>
      <Router>
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="boards" element={<Dashboard />} />
            <Route path="boards">
              <Route path=":id" element={<BoardDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthUserProvider>
  );
}

export default App;
