// LoginRegisterPopup.js
import React, { useState } from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
`;

const FeedbackMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const LoginRegisterPopup = ({ onClose, onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleLogin = async () => {
    try {
      await onLogin(username, password);
    } catch (error) {
      setFeedbackMessage('Feil ved innlogging. Vennligst prøv igjen.');
      console.error('Feil ved innlogging:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await onRegister(username, password);
    } catch (error) {
      setFeedbackMessage('Feil ved registrering. Vennligst prøv igjen.');
      console.error('Feil ved registrering:', error);
    }
  };

  return (
    <PopupContainer>
      <h2>Login / Register</h2>
      <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
      <Button onClick={handleRegister}>Register</Button>
      <Button onClick={onClose}>Close</Button>
      {feedbackMessage && <FeedbackMessage>{feedbackMessage}</FeedbackMessage>}
    </PopupContainer>
  );
};

export default LoginRegisterPopup;
