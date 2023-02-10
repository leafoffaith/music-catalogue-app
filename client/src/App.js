import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import { accessToken, logout } from './spotify';
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist } from './pages';
import { GlobalStyles } from './styles';
import styled from 'styled-components/macro';

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="app">
      <GlobalStyles />

      {!token ? (
        <Login />
      ) : (
        <>
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>

          <Router>
            <ScrollToTop />

            <Switch>
              <Route path="/top-artists">
                <TopArtists />
              </Route>
              <Route path="/top-tracks">
                {/* <h1>Top Tracks</h1> */}
                <TopTracks />
              </Route>
              <Route path="/playlists/:id">
                {/* <h1>Playlist</h1> */}
                <Playlist />
              </Route>
              <Route path="/playlists">
                <Playlists />
              </Route>
              <Route path="/">
                <Profile />
              </Route>
            </Switch>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;

// import { useState, useEffect } from 'react';
// import { accessToken, logout, getCurrentUserProfile } from './spotify'
// import logo from './logo.svg';
// import './App.css';
// import styled from 'styled-components/macro';
// import { GlobalStyle } from './styles'
// import { Login, Profile } from './pages'
// import { createGlobalStyle } from 'styled-components';
// import { catchErrors } from './utils';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link, 
//   useLocation
// } from 'react-router-dom';

// const StyledLogoutButton = styled.button`
//   position: absolute;
//   top: var(--spacing-sm);
//   right: var(--spacing-md);
//   padding: var(--spacing-xs) var(--spacing-sm);
//   background-color: rgba(0,0,0,.7);
//   color: var(--white);
//   font-size: var(--fz-sm);
//   font-weight: 700;
//   border-radius: var(--border-radius-pill);
//   z-index: 10;
//   @media (min-width: 768px) {
//     right: var(--spacing-lg);
//   }
// `;


// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }
// // Unused now replaced by Login component in Pages
// // const StyledLoginButton = styled.a`
// //   background-color: #1db954;
// //   color: #fff;
// //   padding: 10px 20px;
// //   margin: 20px auto;
// //   border-radius: 30px;
// //   display: inline-block;
// //   `;

// // const GlobalStyle = createGlobalStyle`
// // :root{
// //   --black: #121212;
// //   --green: #1db954;
// //   --white: #ffffff;

// //   --font: 'Circular Std', -apple-systen, BlinkMacSystemFont, system-ui, sans-serif;

// // }

// // html {
// //   box-sizing: border-box;
// // }

// // *,
// // *:before,
// // *:after {
// //   box-sizing: inherit;
// // }

// // body {
// //   margin: 0;
// //   padding: 0;
// //   background-color: black;
// //   color: white;
// // }`

// const StyledLoginButton = styled.a`
//   background-color: var(--green);
//   color: var(--white);
//   padding: 10px 20px;
//   margin: 20px auto;
//   border-radius: 30px;
//   display: inline-block;
// `

// function App() {

//   console.log(typeof(accessToken));
//   const [token, setToken] = useState(null);
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {

//     setToken(accessToken);
//     //set to the accessToken variable 'imported' above

//     //Since getCurrentUserProfile() returns a promise, we need to wait for the promise to be resolved using await.
//     //Since the await operator can only be used inside async functions, we handle this by creating an async function called fetchData() within our useEffect hook and invoking it. 
//     //It's cleanest to do it this way because making the useEffect hook itself async gets hairy pretty quickly.
//     const fetchData = async () => {
//       const { data } = await getCurrentUserProfile();
//       setProfile(data);

//     };

//     // console.log(accessToken)
//     // console.log(refreshToken)

//     // if(refreshToken) {
//     //   fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`)
//     //   .then(res => res.json())
//     //   .then(data => console.log(data))
//     //   .catch(err => console.log(err))
//     // }
//     catchErrors(fetchData());

//   }, [])


//   // The second argument of useEffect function is referred to as the “dependency array”. 
//   //When the variable included inside the array didn’t change, the function passed as the first argument won’t be executed.


//   return (
//     <div className="App" >
      
//       <GlobalStyle />

//       {console.log(typeof(catchErrors))}
//       {console.log(typeof(createGlobalStyle))}

//       {/* <button onClick={decrementCount}>-</button>
//           <span>{count}</span> */}
//       <header className="App-header" >
        
//       {/* <StyledLoginButton
//           className="App-link"
//           href="http://localhost:8888/login"> Log in to Spotify
//         </StyledLoginButton> */}
//         {!token ? (<Login />) : (
//           <>
//           <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
//           <Router>
//             {/* <div>
//               <ScrollToTop />
//               <Link to="/">Home</Link>
//               <Link to="/top-artists">Top Artists</Link>
//               <Link to="/top-tracks">Top Tracks</Link>
//               <Link to="/playlists/:id">Playlists</Link>
//               <Link to="/playlists">Playlist</Link>
//             </div> */}
            
//             <Switch>
//               {/* The order of the routes is important */}
//               <Route path="/top-artists">
//                 <h1>Top Artists</h1>
//               </Route>
//               <Route path="/top-tracks">
//                 <h1>Top Tracks</h1>
//               </Route>
//               <Route path="/playlists/:id">
//                 <h1>Playlists</h1>
//               </Route>
//               <Route path="/playlists">
//                 <h1>Playlists</h1>
//               </Route>
//               <Route path="/">
//                 {/* <>
//                   <h1>Logged in!</h1>
//                   <button onClick={logout}>Log Out</button>
//                   {profile && (
//                     <div>
//                       <h1>{profile.display_name}</h1>
//                       <p>{profile.followers.total} Followers</p>
//                       {profile.images.length && profile.images[0].url && (
//                         <img src={profile.images[0].url} alt="Profile" />
//                       )}
//                     </div>
//                   )
//                   }
//                 </> */}
//                 <Profile />
//               </Route>
//             </Switch>
//           </Router>
//           </>
//         )}
//       </header>
//     </div>
//   );
// }

// export default App;
