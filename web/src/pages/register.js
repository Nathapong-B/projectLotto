import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";


function Register() {
    const user = config.user;
    const [userData, setUserData] = useState(user);
    const [confirmPwd, setConfirmPwd] = useState("");
    const [pwdAlert, setPwdAlert] = useState(false);

    const nav = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const payload = userData;
            const res = await axios.post(config.apiPath + '/api/user/create', payload)
            if (res.data.state === 'success') {
                await Swal.fire({
                    title: 'Success',
                    text: 'ลงทะเบียนเรียบร้อยแล้ว เข้าสู่ระบบเพื่อใช้งาน',
                    icon: 'success',
                    timer: 2000
                })
                nav("/login")
                console.log('success')
            } else if (res.data.state === 'already') {
                Swal.fire({
                    title: 'User is Already',
                    text: 'ชื่อผู้ใช้นี้มีอยู่แล้ว โปรดเปลี่ยนชื่อผู้ใช้ใหม่',
                    icon: 'error',
                })
            }
        } catch (err) {
            console.log(err)
        }
    } // end handleRegister

    const checkPwdMatch = (pwd) => {
        if (pwd === "") {
            return false;
        }

        if (pwd !== userData.pwd) {
            return setPwdAlert(true)
        }

        return setPwdAlert(false)
        // console.log(pwd)
    } // end checkPwdMatch

    // const testtext="The Sun Set"
    // const debug = () => {
    //     console.log(testtext.toLowerCase())
    // }

    return (
        <div className="mt-5">
            {/* <button className="btn btn-primary" onClick={debug}>debug</button> */}
            <h1 className="text-center text-light">Register</h1>
            <div className="alert alert-secondary col-8 col-md-4 mx-auto p-4 mt-3">
                <div >
                    <form onSubmit={handleRegister}>
                        <div>
                            <label className="ps-2 fs-14px">Full Name</label>
                            <input className="form-control" onChange={(e) => setUserData({ ...userData, name: e.target.value })} value={userData.name} placeholder="Input Your Name" required />
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">User Name</label>
                            <input className="form-control" onChange={(e) => setUserData({ ...userData, user: e.target.value })} value={userData.user} placeholder="Input Your User Name" required />
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">Password</label>
                            <input type="password" className="form-control" onChange={(e) => setUserData({ ...userData, pwd: e.target.value })} value={userData.pwd} placeholder="Input Your Password" required />
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">Confirm Password</label>
                            <input type="password" onChange={(e) => setConfirmPwd(e.target.value)} onBlur={(e) => { checkPwdMatch(e.target.value) }} value={confirmPwd} className={pwdAlert ? "form-control is-invalid" : "form-control"} placeholder="Confirm Password" required />
                            <div className="invalid-feedback">Password not match.</div>
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">E-mail</label>
                            <input className="form-control" onChange={(e) => setUserData({ ...userData, email: e.target.value })} value={userData.email} placeholder="Input Your E-mail" required />
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">Phone</label>
                            <input className="form-control" onChange={(e) => setUserData({ ...userData, phone: e.target.value })} value={userData.phone} placeholder="Input Your Phone Number" required />
                        </div>
                        <div className="mt-2">
                            <label className="ps-2 fs-14px">Address</label>
                            <input className="form-control" onChange={(e) => setUserData({ ...userData, address: e.target.value })} value={userData.address} placeholder="Input Your Address" required />
                        </div>
                        <div className="mt-2">
                            <input id="termandcondition" type="checkbox" className="form-check-input me-2" required ></input>
                            <label htmlFor="termandcondition" className="me-2">Term and Condition (ข้อตกลงและเงื่อนไข)</label>
                            <Link to="/termandcondition" className="fs-14px" target="_blank"><i className="fa fa-file-lines me-1"></i>อ่าน</Link>
                        </div>
                        <div className="mt-4 d-grid">
                            <button className="btn btn-primary"><i className="fa fa-check me-2"></i>Register</button>
                        </div>
                    </form>
                    <div className="text-end fs-14px mt-3">
                        <Link to="/login" className="me-4"><span className="text-dark">Log in</span></Link>
                        <Link to="/"><span className="text-dark">Home</span></Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register;