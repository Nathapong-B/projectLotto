import { useState } from "react";
import Navbar from "../components/navbar";

function Myinput(){
    const [message , setMessage] = useState();
    return (
        <div>
            <Navbar />
            <input onChange={e=> setMessage(e.target.value)} />
            <div>message : {message}</div>
        </div>
    )
}

export default Myinput;