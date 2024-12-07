import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function TestReceivedParams() {
    const [searchParams] = useSearchParams();

    // console.log(searchParams.get('id'))
    // console.log(searchParams.get('name'))
    const paramsId = searchParams.get('id')
    const paramsName = searchParams.get('name')

    const urlGoogle = "https://www.google.com/"

    const [alertMsg, setAlertMsg] = useState(false);
    const [num, setNum] = useState();
    const classSuccess = "d-flex justify-content-center alert alert-info"
    const[timerId,setTimerId] = useState(0);
    const alertMessage = (num) => {
        setNum(num)
        setAlertMsg(true)
        console.log("true")
        clearTimeout(timerId)
        const tId = setTimeout(() => {
            setAlertMsg(false)
            console.log("false")
            setNum(0)
            console.log(timerId)
        }, 2000)
        setTimerId(tId)
    }

    return (
        <div>
            <div id='alert-message' className={alertMsg ? "position-absolute start-50 translate-middle-x w-50 mt-2" : "hidden"}>
                <div className={num === 1 ? classSuccess : "d-flex justify-content-center alert alert-danger"}>
                    <span className="">{num === 1 ? "success" : "error"}</span>
                </div>
            </div>
            <button className="btn btn-primary" onClick={() => alertMessage(1)}>click1</button>
            <button className="btn btn-primary" onClick={() => alertMessage(2)}>click2</button>

            <h4 className="text-center text-light mt-4">Test Received Params</h4>
            <p className="text-center text-light">
                <span>Params ที่ส่งมา</span><br></br>
                <span>Id : </span>{paramsId}
                <span> , Name : </span>{paramsName}
            </p>

            <div className="text-center">
                <Link to={urlGoogle} target="_blank">test external link (google)</Link>
            </div>

        </div>
    )
}