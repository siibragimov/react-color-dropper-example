import { useState } from 'react'
import { DropperCanvas } from './components/DropperCanvas/DropperCanvas'
import { InputImage } from './components/InputImage/InputImage'
import './App.css'

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  return (
    <>
      <h1>Color Dropper</h1>
      <div className="card">
        <DropperCanvas image={image} />
        <InputImage onChange={setImage} />
      </div>
    </>
  )
}

export default App
