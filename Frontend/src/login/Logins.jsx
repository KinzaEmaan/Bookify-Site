import React from "react";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Footer from "../components/Footer";
function Logins(){
    return(
<>
<Navbar/>
<div className="min-h-screen">
<Login/>
</div>
<Footer/>
</>
    )
} 
export default Logins;