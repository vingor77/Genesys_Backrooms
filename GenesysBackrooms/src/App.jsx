import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Main_Pages/homePage'
import Groups from './Main_Pages/groups'
import Outposts from './Main_Pages/outposts'
import Levels from './Main_Pages/levels'
import Objects from './Main_Pages/objects'
import Entities from './Main_Pages/entities'
import Quests from './Main_Pages/quests'
import Information from './Main_Pages/information'
import Crafting from './Main_Pages/crafting'
import Navbar from './Components/navbar'
import PeopleOfInterest from './Main_Pages/peopleOfInterest'
import Bethal from './Bethal/bethalBompany'
import MundaneObjects from './Main_Pages/mundaneObjects'
import Armor from './Main_Pages/armor'
import Weapons from './Main_Pages/weapons'
import Phenomenons from './Main_Pages/phenomenons'
import Timers from './Main_Pages/timers'
import Login from './Components/login'
import NotLoggedIn from './Components/notLoggedIn'
import SignUp from './Components/signUp'

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
          <Route path='/entities' element={<Entities />} />
          <Route path='/quests' element={<Quests />} />
          <Route path='/information' element={<Information />} />
          <Route path='/crafting' element={<Crafting />} />
          <Route path='/interest' element={<PeopleOfInterest />} />
          <Route path='/bethal' element={<Bethal />} />
          <Route path='/mundane' element={<MundaneObjects />} />
          <Route path='/armor' element={<Armor />} />
          <Route path='/weapons' element={<Weapons />} />
          <Route path='/phenomenons' element={<Phenomenons />} />
          <Route path='/timers' element={<Timers />} />
          <Route path='/login' element={<Login />} />
          <Route path='/notLoggedIn' element={<NotLoggedIn />} />
          <Route path='/signUp' element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
