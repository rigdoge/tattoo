import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GlobeComponent from './components/Globe'
import DistributorManager from './components/DistributorManager'

function App() {
  return (
    <div className="w-screen h-screen">
      <GlobeComponent />
      <DistributorManager />
    </div>
  )
}

export default App
