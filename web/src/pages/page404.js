import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";

export default function Page404() {
    // const opj ={}

    // const click =()=>{
    //     opj.age="24"
    // }

    // const testapi = async () => {
    //     const payload = {
    //         name: 'jonathan',
    //         age: '19',
    //     };

    //     const headers = {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem('lottoToken'),
    //         }
    //     }
    //     // const headers = () => {
    //     //     return {
    //     //         headers: {
    //     //             Authorization: "Bearer " + localStorage.getItem('lottoToken'),
    //     //         }
    //     //     }
    //     // };

    //     const res = await axios.post(config.apiPath + '/api/user/testapi', payload, headers)
    //     console.log(res.data)
    // }

    // const debug = () => {
    // console.log(opj)
    // }
    return (
        <div>
            <div className="text-center mt-5 text-light">
                <h1 className="fw-bold">404</h1>
                <h1 className="fw-bold">NOT FOUND</h1>
                <Link to="/" className="text-light"><span>&#8249;- กลับหน้าหลัก</span></Link>
            </div>
            {/* <button className="btn btn-primary m-4" onClick={debug}>debug</button> */}
        </div >
    )
}