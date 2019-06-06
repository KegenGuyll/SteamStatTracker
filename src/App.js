import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import Layout from './components/Common/Layout';
import Navigation from './components/Common/Navigation';
import Home from './components/Home';
import Compare from './components/Compare';

const App = () => {
  return (
    <Router>
      <Switch>
        <Navigation>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/profile/:steamid?' component={Profile} />
            <Route path='/compare/:steamid?' component={Compare} />
          </Layout>
        </Navigation>
      </Switch>
    </Router>
  );
};

export default App;
