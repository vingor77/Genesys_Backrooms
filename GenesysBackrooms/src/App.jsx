import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

//Structural
import Navbar from './Structural/Navbar'
import Login from './Structural/Login'
import Sign_Up from './Structural/Sign_Up'
import Not_Logged_In from './Structural/Not_Logged_In'
import Session_Selector from './Structural/Session_Selector'

//Settings Pages
import ProfileSettings from './Core/ProfileSettings'
import Preferences from './Core/Preferences'
import SessionSettings from './Core/SessionSettings'

//Collections
import Crafts from './Collections/Crafts'
import Entities from './Collections/Entities'
import Factions from './Collections/Factions'
import Levels from './Collections/Levels'
import Phenomena from './Collections/Phenomena'
import POI from './Collections/POI'
import Objects from './Collections/Objects'
import Outposts from './Collections/Outposts'
import Quests from './Collections/Quests'
import GearSets from './Collections/ItemSets'
import Relations from './Collections/Relations'
import PlayerPage from './Features/Player/PlayerPage'
import DMPage from './Features/DM/DMPage'

//Core Pages
import Home from './Core/Home'
import Rules from './Core/Rules'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Sign_Up />} />
        <Route path='/notloggedin' element={<Not_Logged_In />} />
        <Route path='/session-selector' element={<Session_Selector />} />

        {/* Settings Routes */}
        <Route path='/profile-settings' element={<ProfileSettings />} />
        <Route path='/preferences' element={<Preferences />} />
        <Route path='/session-settings' element={<SessionSettings />} />

        {/* Main Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/rules' element={<Rules />} />

        {/* Tools Routes */}
        <Route path='/player-features' element={<PlayerPage />} />
        <Route path='/dm-features' element={<DMPage />} />

        {/* Content Routes */}
        <Route path='/crafts' element={<Crafts />} />
        <Route path='/entities' element={<Entities />} />
        <Route path='/factions' element={<Factions />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/objects' element={<Objects />} />
        <Route path='/gear-sets' element={<GearSets />} />

        {/* World Routes */}
        <Route path='/poi' element={<POI />} />
        <Route path='/phenomena' element={<Phenomena />} />
        <Route path='/outposts' element={<Outposts />} />
        <Route path='/quests' element={<Quests />} />
        <Route path='/relations' element={<Relations />} />
      </Routes>
    </Router>
  )
}

export default App