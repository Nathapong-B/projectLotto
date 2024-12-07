import { useState, useReducer } from "react";
import Navbar from "../components/navbar";

function Testreducer() {
    // Test Resucer and function Param
    const [num, setNum] = useState(0);
    // const paramType=0;

    function Reduc(state, action) {
        switch (action.type) {
            case 'add': {
                return (state + 1);
            }
            case 'sub': {
                return (state - 1);
            }
        }
        throw Error('error : message in throw');
    }

    // const [res, dispatch] = useReducer(Reduc, paramType);
    const [res, dispatch] = useReducer(Reduc, num);

    function testClick(para) {
        return setNum(num + para);
    }

    return (
        <div>
            <Navbar />
            <fieldset align="center" style={{ border: "1px solid black", width: "25%", margin: "10px auto", padding: "10px" }}>
                <legend>Test Area</legend>
                <div>Reducer {res}</div>
                <button onClick={() => { dispatch({ type: 'add' }) }}>+</button>
                <button onClick={() => { dispatch({ type: 'sub' }) }}>-</button>

                <div>Click {num}</div>
                <button onClick={() => { testClick(5) }}>+</button>
                <button onClick={() => { testClick(-3) }}>-</button>
            </fieldset>
        </div>
    )

}

export default Testreducer;
