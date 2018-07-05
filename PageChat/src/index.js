import React from 'react';
import ReactDOM from 'react-dom';
import Routes from "./routes";

import './statics/css/app.css'
import './statics/css/collapsiblesidebar.css'
import './statics/css/chat.css'
import './statics/css/form.css'
// import './statics/css/bootstrap4.1.0.min.css'



//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Routes />, document.getElementById('wrapper'));

//registerServiceWorker();

