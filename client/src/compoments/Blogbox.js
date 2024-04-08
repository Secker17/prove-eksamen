import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Feil ved henting av innlegg:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Innlegg</h2>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <h3>{post.title}</h3>
            <p>{post.info}</p>
            <p>{post.creditText}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
