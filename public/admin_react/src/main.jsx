import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
    <RecoilRoot>
        <HashRouter>
            <App />
        </HashRouter>
    </RecoilRoot>
    //</React.StrictMode>
)
