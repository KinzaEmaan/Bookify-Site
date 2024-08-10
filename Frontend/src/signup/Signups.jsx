import React from "react";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import Footer from "../components/Footer";
function Signups(){
    return(
<>
<Navbar/>
<div className="min-h-screen">
<Signup/>
</div>
<Footer/>
</>
    )
} 
export default Signups;