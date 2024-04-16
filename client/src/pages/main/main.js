import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo1.png';
import '../main/main.css'; // Import the centralized CSS file


const PostList = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:5000/api/posts';
        if (loggedInUser) {
          url += `/${loggedInUser}`;
        }
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error('Feil ved henting av innlegg:', error);
      }
    };

    fetchPosts();
  }, [loggedInUser]);

  return (
    <div>
      <h2>Innlegg</h2>
      {posts.map((post, index) => (
        <div className="post-box" key={index}>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-content">{post.info}</p>
          <p className="cred-text">{post.credText}</p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [registerPopupOpen, setRegisterPopupOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('loggedIn=true');
    if (isLoggedIn) {
      setLoggedIn(true);
      const savedUsername = localStorage.getItem('username');
      console.log('Retrieved username:', savedUsername); // Check the retrieved username
      if (savedUsername) {
        setUsername(savedUsername);
        setLoggedInUser(savedUsername);
      }
    }
  }, []);
  

  const handleLoginPopup = () => setLoginPopupOpen(true);
  const handleRegisterPopup = () => setRegisterPopupOpen(true);
  const handleClosePopup = () => {
    setLoginPopupOpen(false);
    setRegisterPopupOpen(false);
    setLoginError('');
    setRegisterError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const setCookie = () => document.cookie = 'loggedIn=true;max-age=3600';
  const removeCookie = () => document.cookie = 'loggedIn=;max-age=0';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Vennligst fyll ut både brukernavn og passord.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      setUsername(response.data.username);
      console.log('Username set to:', response.data.username);      setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.username);
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Innloggingsfeil:', error.response.data.message);
      if (error.response && error.response.status === 401) {
        setLoginError('Ugyldig brukernavn eller passord. Vennligst prøv igjen.');
      } else if (error.response && error.response.status === 404) {
        setLoginError('Brukernavnet eksisterer ikke. Vennligst registrer deg.');
      } else {
        setLoginError('Det oppstod en feil. Vennligst prøv igjen senere.');
      }
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    removeCookie();
    setLoggedInUser('');
    localStorage.removeItem('username');
    document.cookie = 'username=;max-age=0';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setRegisterError('Vennligst fyll ut alle feltene.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passordene stemmer ikke overens.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
    });
    console.log('Login response:', response.data);
    setUsername(response.data.username);
    localStorage.setItem('username', response.data.username);
    
    setUsername(response.data.user.username);
    setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.user.username); // Same here
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Registreringsfeil:', error.response.data.message);
      setRegisterError(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="navbar-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>{loggedIn ? `Bitter - ${username}` : "Bitter"}</h1>
        <div className="navbar-links">
          {!loggedIn && (
            <>
              <button className="navbar-button" onClick={handleLoginPopup}>Logg inn</button>
              <button className="navbar-button" onClick={handleRegisterPopup}>Registrer</button>
            </>
          )}
          {loggedIn && <button className="navbar-button" onClick={handleLogout}>Logg ut</button>}
        </div>
      </div>

      {loginPopupOpen && (
        <div className="popup-container">
          <div className="form-container">
            <form className="form" onSubmit={handleLogin}>
              <h2>Logg inn</h2>
              <input
                className="input"
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="feedback-message">{loginError}</p>
              <button className="submit-button" type="submit">Logg inn</button>
              <button className="close-button" type="button" onClick={handleClosePopup}>
                Lukk
              </button>
            </form>
          </div>
        </div>
      )}

      {registerPopupOpen && (
        <div className="popup-container">
          <div className="form-container">
            <form className="form" onSubmit={handleRegister}>
              <h2>Registrer</h2>
              <input
                className="input"
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Bekreft Passord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p className="feedback-message">{registerError}</p>
              <button className="submit-button" type="submit">Registrer</button>
              <button className="close-button" type="button" onClick={handleClosePopup}>
                Lukk
              </button>
            </form>
          </div>
        </div>
      )}

      <PostList loggedInUser={loggedInUser} />
    </div>
  );
};

export default App;
