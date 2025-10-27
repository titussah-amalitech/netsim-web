import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './store/index.js'
import { Provider } from 'react-redux'
import { AppProviders } from './providers/AppProviders'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <Provider store={store}>
        <App />
      </Provider>
    </AppProviders>
  </StrictMode>
)
