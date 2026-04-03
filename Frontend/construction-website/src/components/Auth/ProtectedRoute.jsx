import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '../../layout/DashboardLayout';


const ProtectedRoute = () => {
    const isAuthenticated = !!localStorage.getItem("token");
 
    return isAuthenticated ? (
    <DashboardLayout>
        <Outlet/>
    </DashboardLayout>
   ) : (
    <Navigate to="login" replace/>
   )
}


export default ProtectedRoute;
