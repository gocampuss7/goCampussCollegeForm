import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CollegeForm from './components/CollegeForm'
import AllCollege from './components/AllCollege'
import CollegeDetail from './components/CollegeDetail'
import Navbar from './common/Navbar'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<CollegeForm/>} />
        <Route path="/all-colleges" element={<AllCollege/>} />
        <Route path="/college/:id" element={<CollegeDetail/>} />
        <Route path="/edit/:id" element={<CollegeForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App