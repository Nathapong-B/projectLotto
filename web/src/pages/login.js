import axios from "axios";
import { useState } from "react";
import alertBox from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const payload = { user: username, pwd: password } //ตัวแปรที่ส่งไป back end ต้องตั้งชื่อให้ตรงกัน (user,pwd)
            await axios.post(config.apiPath + "/api/user/login", payload).then((res) => {
                if (res.data.token !== undefined) {
                    alertBox.fire({
                        title: "Success",
                        text: "Welcome back " + username,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1700
                    })

                    //const token = res.data.token.access_token;
                    localStorage.setItem("lottoToken", res.data.token.access_token);

                    setTimeout(() => {
                        nav("/");
                    }, 1500);
                    // console.log(res.data);

                } else {
                    alertBox.fire({
                        title: "Invalid..!!",
                        text: res.data.message,
                        icon: "error",
                    })
                    console.log(res.data);
                }

            }).catch((err) => {
                alertBox.fire({
                    title: "Invalid..!!",
                    text: err.message,
                    icon: "error",
                })
                console.log(err);
            })
        } catch (e) {
            alertBox.fire({
                title: "Invalid",
                text: e,
                icon: "error",
            })
        }
    }

    return (
        <div className="mt-5">
            <h1 className="text-center text-light">Sign In</h1>
            <div className="alert alert-secondary col-8 col-md-4 mx-auto p-3 mt-3 d-flex justify-content-evenly align-items-center">
                <div>
                    <Link to="/"><img src="../favicon2.ico" alt="logo" width={100}></img></Link>
                </div>

                <div className="border-start border-light border-2 mx-4" style={{height:"180px"}}></div>

                <div >
                    <form onSubmit={handleSignin}>
                        <div>
                            <span className="ps-3"><i className="fa fa-user me-2"></i>User Name</span>
                            <input onChange={(e) => { setUsername(e.target.value) }} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <span className="ps-3"><i className="fa fa-lock me-2"></i>Password</span>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
                        </div>
                        <div className="mt-4 d-grid">
                            <button className="btn btn-primary"><i className="fa fa-check me-2"></i>Sign In</button>
                        </div>
                    </form>
                    <div className="text-end fs-14px mt-3">
                        <Link to="/register"><span className="text-dark">Register</span></Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login;