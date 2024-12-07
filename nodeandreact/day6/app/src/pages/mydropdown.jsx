import { useState } from "react";

function Mydropdown(){
    const [item , setItem] = useState();
    return (
        <div>
            <p>ค่าที่เลือก : {item}</p>
            <select onChange={e=> setItem(e.target.value)}>
                <option value="01">AAA</option>
                <option value="02">BBB</option>
                <option value="03">CCC</option>
            </select>
        </div>
    )
}

export default Mydropdown;