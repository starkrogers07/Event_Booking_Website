import React, { Component } from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

import AuthPage from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import authContext from './components/context/auth-context';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    this.state = {
      token: storedToken,
      userId: storedUserId,
    };
  }

  login = (token, userId) => {
    this.setState({ token: token, userId: userId });
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  render() {
    return (
      <React.Fragment>
        <authContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              {!this.state.token && <Route path="/" element={<Navigate replace to="/auth" />} />}
              {!this.state.token && <Route path="/bookings" element={<Navigate replace to="/auth" />} />}
              {this.state.token && <Route path="/" element={<Navigate replace to="/events" />} />}
              {this.state.token && <Route path="/auth" element={<Navigate replace to="/events" />} />}
              {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
              <Route path="/events" element={<Events />} />
              {this.state.token && <Route path="/bookings" element={<Bookings />} />}
            </Routes>
          </main>
        </authContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
