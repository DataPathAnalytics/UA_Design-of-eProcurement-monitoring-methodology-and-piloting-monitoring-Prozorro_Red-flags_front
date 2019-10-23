import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import {Provider} from 'react-redux'
import App from 'containers/App'
import configureStore from 'store/configureStore'
// import 'semantic-ui-css/semantic.min.css';
import 'static/styles5.css';
import 'static/index.css';

const store = configureStore();

render(<Provider store={store}><App /></Provider>,document.getElementById('root'));
