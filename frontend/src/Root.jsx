import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { me } from "./services/api";

function Guard({ children }){
  const [ok,setOk]=useState(null);
  useEffect(()=>{ me().then(()=>setOk(true)).catch(()=>setOk(false)); },[]);
  if (ok===null) return <div className="p-6">Loading…</div>;
  return ok ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Guard><App /></Guard> },
  { path: "/login", element: <Login onAuthed={()=>window.location.href="/"} /> },
  { path: "/signup", element: <Signup /> },
]);

export default function Root(){
  return <RouterProvider router={router} />;
}