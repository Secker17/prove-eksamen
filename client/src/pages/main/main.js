import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from './logo1.png';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
`;

const Logo = styled.img`
  width: 140px;
`;

const NavbarLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarButton = styled.button`
  padding: 10px 20px;
  margin-left: 20px;
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 350px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FeedbackMessage = styled.p`
  color: red;
  font-size: 14px;
  height: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #3c9f4c;
  color: #fff;
  border: 2px solid #3c9f4c;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #fff;
    color: #3c9f4c;
  }
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #c9353b;
  color: #fff;
  border: 2px solid #c9353b;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #fff;
    color: #c9353b;
  }
`;

const PostBox = styled.div`
  width: 1000px;
  height: 350px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 0 auto 20px auto;
  position: relative;
`;

const PostTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 20px;
`;

const PostContent = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
`;

const CredText = styled.p`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  color: #666;
`;

const PostList = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:5000/api/posts';
        if (loggedInUser) {
          url = `http://localhost:5000/api/posts/${loggedInUser}`;
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
        <PostBox key={index}>
          <PostTitle>{post.title}</PostTitle>
          <PostContent>{post.info}</PostContent>
          <CredText>{post.credText}</CredText>
        </PostBox>
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
      if (savedUsername) {
        setUsername(savedUsername);
        setLoggedInUser(savedUsername);
      }
    }
  }, []);

  const handleLoginPopup = () => {
    setLoginPopupOpen(true);
  };

  const handleRegisterPopup = () => {
    setRegisterPopupOpen(true);
  };

  const handleClosePopup = () => {
    setLoginPopupOpen(false);
    setRegisterPopupOpen(false);
    setLoginError('');
    setRegisterError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const setCookie = () => {
    document.cookie = 'loggedIn=true;max-age=3600';
  };

  const removeCookie = () => {
    document.cookie = 'loggedIn=;max-age=0';
  };

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
      setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.username);
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Innloggingsfeil:', error.response.data.message);
      if (error.response.status === 401) {
        setLoginError('Ugyldig brukernavn eller passord. Vennligst prøv igjen.');
      } else if (error.response.status === 404) {
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
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      setUsername(response.data.username);
      setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.username);
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Registreringsfeil:', error.response.data.message);
      setRegisterError(error.response.data.message);
    }
  };

  return (
    <div>
      <NavbarContainer>
        <Logo src={logo} alt="Logo" />
        <h1>{loggedIn ? `Bitter - ${username}` : "Bitter"}</h1>
        <NavbarLinks>
          {!loggedIn && (
            <React.Fragment>
              <NavbarButton onClick={handleLoginPopup}>Logg inn</NavbarButton>
              <NavbarButton onClick={handleRegisterPopup}>Registrer</NavbarButton>
            </React.Fragment>
          )}
          {loggedIn && <NavbarButton onClick={handleLogout}>Logg ut</NavbarButton>}
        </NavbarLinks>
      </NavbarContainer>

      {loginPopupOpen && (
        <PopupContainer>
          <FormContainer>
            <Form onSubmit={handleLogin}>
              <h2>Logg inn</h2>
              <Input
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FeedbackMessage>{loginError}</FeedbackMessage>
              <SubmitButton type="submit">Logg inn</SubmitButton>
              <CloseButton type="button" onClick={handleClosePopup}>
                Lukk
              </CloseButton>
            </Form>
          </FormContainer>
        </PopupContainer>
      )}
      {registerPopupOpen && (
        <PopupContainer>
          <FormContainer>
            <Form onSubmit={handleRegister}>
              <h2>Registrer</h2>
              <Input
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Bekreft Passord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FeedbackMessage>{registerError}</FeedbackMessage>
              <SubmitButton type="submit">Registrer</SubmitButton>
              <CloseButton type="button" onClick={handleClosePopup}>
                Lukk
              </CloseButton>
            </Form>
          </FormContainer>
        </PopupContainer>
      )}

      <PostList loggedInUser={loggedInUser} />
    </div>
  );
};

export default App;
