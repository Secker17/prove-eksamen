import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div>
      <h1>Registered Users</h1>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No registered users.</p>
      )}
    </div>
  );
};

export default UserList;
