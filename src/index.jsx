import React from 'react'
import { Router } from 'react-router-dom'
import { render } from 'react-dom'

import { history } from './_helpers'
import { accountService } from './_services'
import { App } from './app'

import './styles.less'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// setup fake backend
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();

// attempt silent token refresh before startup
accountService.refreshToken().finally(startApp)

function startApp() {
  render(
    <Router history={history}>
      <App />
      <ToastContainer />
    </Router>,
    document.getElementById('app')
  )
}
