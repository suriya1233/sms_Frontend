
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import StudentPage from './pages/StudentPage.jsx'
import StudentLeaveApply from './pages/StudentLeaveApply.jsx'
import StudentAttendance from './pages/StudentAttendance.jsx'
import StudentGrades from './pages/StudentGrades.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminLeaveApproval from './pages/AdminLeaveApproval.jsx'
import AddStudent from './pages/AddStudent.jsx'
import ManageAttendance from './pages/ManageAttendance.jsx'
import ManageGrades from './pages/ManageGrades.jsx'
import ProtectedRoute from './utils/protectedRoute/ProtectedRoute.jsx'
import './pages/LoginPage.css'



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path='/student-Page' element={<StudentPage />} />
          <Route path='/leave-apply' element={<StudentLeaveApply />} />
          <Route path='/my-attendance' element={<StudentAttendance />} />
          <Route path='/my-grades' element={<StudentGrades />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path='/admin-Page' element={<AdminPage />} />
          <Route path='/leave-approval' element={<AdminLeaveApproval />} />
          <Route path='/add-student' element={<AddStudent />} />
          <Route path='/manage-attendance' element={<ManageAttendance />} />
          <Route path='/manage-grades' element={<ManageGrades />} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
