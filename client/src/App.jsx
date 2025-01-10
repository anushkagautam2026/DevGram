import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/Dashboard' element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
