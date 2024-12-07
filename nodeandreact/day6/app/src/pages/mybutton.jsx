import { useState } from "react";

function Mybutton() {
    let [x, setX] = useState(0);

    return (
        <div>
            <label>x = {x}</label>
            <button onClick={e => setX(x + 1)}>Click Here</button>
        </div>
    )
}

export default Mybutton;