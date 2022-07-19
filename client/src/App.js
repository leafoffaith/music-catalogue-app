import { useState, useEffect } from 'react';
import { accessToken } from './spotify'
import logo from './logo.svg';
import './App.css';


function App() {

    const [token, setToken] = useState(null);

    useEffect(() => {

        setToken(accessToken);
        //set to the accessToken variable 'imported' above


        // console.log(accessToken)
        // console.log(refreshToken)

        // if(refreshToken) {
        //   fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`)
        //   .then(res => res.json())
        //   .then(data => console.log(data))
        //   .catch(err => console.log(err))
        // }

    }, [])


    return (
    <div className="App" >
        <header className="App-header" >
            if (!token ? ( < a className="App-link"
                href="http://localhost:8888/login" >
                Log in to Spotify </a>
                )): <h1> Logged in </h1>   
                </header> 
                </div>
                    );
}

                    export default App;