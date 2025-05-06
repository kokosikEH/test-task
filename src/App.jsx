import { useState } from 'react' 
import Body from './components/Body' 


function App() {
  const [lang, setLang] = useState('ru')

  return (
    <div className='flex flex-col h-screen w-full items-center p-4'>
      <h1 className='ml-15'>Борисенко Е.Н.</h1>
      <Body />
    </div>

  )
}

export default App
