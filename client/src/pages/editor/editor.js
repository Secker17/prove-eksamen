import React, { useState } from 'react';
import axios from 'axios';

const Editor = ({ loggedInUsername }) => {
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [credText, setCredText] = useState('');
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    try {
      await axios.post('http://localhost:5000/api/posts', { title, info, credText, username: loggedInUsername });
      console.log('Innlegg publisert!');
      setPublished(true);
      // Legg til eventuell annen logikk etter vellykket publisering
    } catch (error) {
      console.error('Feil ved publisering av innlegg:', error);
    }
  };

  return (
    <div>
      <h2>Editor</h2>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={info} onChange={e => setInfo(e.target.value)} placeholder="Info"></textarea>
      <textarea value={credText} onChange={e => setCredText(e.target.value)} placeholder="Cred Text"></textarea>
      <button onClick={handlePublish}>Publish</button>
      {published && <p>Innlegg publisert!</p>}
    </div>
  );
};

export default Editor;
