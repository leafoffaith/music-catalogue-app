import { useState, useEffect } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify'
import logo from './logo.svg';
import './App.css';
import { catchErrors } from './utils';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';


function App() {

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {

    setToken(accessToken);
    //set to the accessToken variable 'imported' above

    //Since getCurrentUserProfile() returns a promise, we need to wait for the promise to be resolved using await.
    //Since the await operator can only be used inside async functions, we handle this by creating an async function called fetchData() within our useEffect hook and invoking it. 
    //It's cleanest to do it this way because making the useEffect hook itself async gets hairy pretty quickly.
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      console.log(data)
    };
    catchErrors(fetchData());

    // console.log(accessToken)
    // console.log(refreshToken)

    // if(refreshToken) {
    //   fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`)
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err))
    // }

  }, [])

  // The second argument of useEffect function is referred to as the “dependency array”. When the variable included inside the array didn’t change, the function passed as the first argument won’t be executed.


  return (
    <div className="App" >
      {/* <button onClick={decrementCount}>-</button>
          <span>{count}</span> */}
      <header className="App-header" >
        {!token ? (<a
          className="App-link"
          href="http://localhost:8888/login"> Log in to Spotify
        </a>) : (
          <Router>
            <div>
              <Link to="/">Home</Link>
              <Link to="/top-artists">Top Artists</Link>
              <Link to="/top-tracks">Top Tracks</Link>
            </div>
            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/top-artists">
                <h1>Top Playlists</h1>
              </Route>

              <Route path="/">
                <>
                  <h1>Logged in!</h1>
                  <button onClick={logout}>Log Out</button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Profile" />
                      )}
                    </div>
                  )
                  }
                </>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;