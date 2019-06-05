import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import Layout from './components/Common/Layout';
import Navigation from './components/Common/Navigation';

const App = () => {
  return (
    <Router>
      <Switch>
        <Navigation>
          <Layout>
            <Route path='/profile' component={Profile} />
          </Layout>
        </Navigation>
      </Switch>
    </Router>
  );
};

export default App;
