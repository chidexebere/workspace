import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './pages/404';
import BoardDetails from './pages/boardDetails';
import Dashboard from './pages/dashboard';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/boards">
            <Dashboard />
          </Route>
          <Route path="/boards/:id">
            <BoardDetails />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
