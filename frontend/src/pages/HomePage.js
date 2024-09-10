import React, { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  const getNotes = useCallback(async () => {
    let response = await fetch('http://127.0.0.1:8000/api/notes/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    });

    let data = await response.json();
    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  }, [authTokens, logoutUser]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div>
      <p>You logged into the HomePage!</p>

      <ul>
        {notes.map((note) => {
          return (
            <li key={note.id}>{note.body}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default HomePage;
