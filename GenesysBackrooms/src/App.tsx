import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Main_Pages/homePage'
import Groups from './Main_Pages/groups'
import Outposts from './Main_Pages/outposts'
import Levels from './Main_Pages/levels'
import Objects from './Main_Pages/objects'
import GearSets from './Main_Pages/gearSets'
import Entities from './Main_Pages/entities'
import Quests from './Main_Pages/quests'
import Information from './Main_Pages/information'
import Gods from './Main_Pages/gods'
import Avatars from './Main_Pages/avatars'
import Crafting from './Main_Pages/crafting'
import Updates from './Main_Pages/updates'
import Navbar from './Components/navbar'

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/groups' element={<Groups />} />
          <Route path='/outposts' element={<Outposts />} />
          <Route path='/levels' element={<Levels />} />
          <Route path='/objects' element={<Objects />} />
          <Route path='/gearsets' element={<GearSets />} />
          <Route path='/entities' element={<Entities />} />
          <Route path='/quests' element={<Quests />} />
          <Route path='/information' element={<Information />} />
          <Route path='/gods' element={<Gods />} />
          <Route path='/avatars' element={<Avatars />} />
          <Route path='/crafting' element={<Crafting />} />
          <Route path='/updates' element={<Updates />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
