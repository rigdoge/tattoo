import React from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GlobeComponent from './components/Globe'
import ArtistManager from './components/ArtistManager'

function App() {
  return (
    <div className="w-screen h-screen">
      <GlobeComponent />
      <ArtistManager />
    </div>
  )
}

export default App
