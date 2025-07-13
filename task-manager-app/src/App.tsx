import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import RequireAuth from "./components/RequireAuth"


function App() {

  return (
    <div className="bg-dark min-vh-100">
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='/' element={<RequireAuth><Home/></RequireAuth>}/>
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
