import axios from "axios";
// import Home from "./home";
import config from "../config";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserManage() {
    const level = ["admin", "user"]
    const [dataUser, setDataUser] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);
    const [confirmPwd, setConfirmPwd] = useState();
    const [titleModal, setTitleModal] = useState();
    const [opt, setOpt] = useState(true);
    const [enableBtn, setEnableBtn] = useState(false);
    const [role, setRole] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/user/list', config.headers())
            if (res.data.length !== undefined) {
                setDataUser(res.data)
                // console.log(res.data)
            } else {
                console.log(res.data)
            }
            setRole(true)
        } catch (err) {
            setRole(false)
            console.log(err)
            await Swal.fire({
                title: "Role Error",
                text: "เข้าสู่ระบบอีกครั้งด้วยบัญชีผู้ดูแล",
                icon: "error",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "ตกลง",
                cancelButtonColor: "#198754"
            }).then((res) => {
                if (res.isConfirmed) {
                    nav("/login")
                }
            })
        }
    } // end fetchData

    const handleSave = async () => {
        try {
            const payload = dataInfo

            if (dataInfo.id !== undefined) {
                const res = await axios.put(config.apiPath + '/api/user/edit/' + dataInfo.id, payload)
                if (res.data.id !== undefined) {
                    Swal.fire({
                        title: "Success",
                        text: "บันทึกข้อมูลเรียบร้อย",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000
                    })
                    fetchData()
                    document.getElementById('btn-close-modalInfo').click()
                }
            } else {
                if (dataInfo.pwd === confirmPwd) {
                    const res = await axios.post(config.apiPath + '/api/user/create', payload)
                    if (res.data.state === 'success') {
                        Swal.fire({
                            title: "Success",
                            text: "บันทึกข้อมูลเรียบร้อย",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000
                        })
                        fetchData()
                        document.getElementById('btn-close-modalInfo').click()
                    }
                } else {
                    console.log("password not match")
                    Swal.fire({
                        title: "Password Not Match",
                        text: "พาสเวิร์ดไม่ตรงกัน",
                        icon: "error",
                    })
                }
            }
        } catch (err) {
            console.log(err)
            Swal.fire({
                title: "Data Error",
                text: "มีบางอย่างผิดพลาด",
                icon: "error",
            })
        }
    } // end handleSave

    const handleDelete = async (item) => {
        try {
            await Swal.fire({
                title: "ยืนยันการลบ",
                html: "ต้องการลบข้อมูลนี้หรือไม่<br>ข้อมูลจะไม่สามารถกู้คืนกลับมาได้อีก",
                icon: "warning",
                showCancelButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    const res = await axios.delete(config.apiPath + '/api/user/del/' + item.id)
                    if (res.data.state === "success") {
                        console.log("delete success")
                        Swal.fire({
                            title: "Success",
                            text: "ลบข้อมูลเรียบร้อย",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000,
                        })
                        fetchData()
                    }
                }
            })
        } catch (err) {
            console.log(err)
            Swal.fire({
                title: "Data Error",
                text: "มีบางอย่างผิดพลาด",
                icon: "error",
            })
        }
    } // end handleDelete

    // const debug = () => {
    //     console.log(dataInfo)
    // }

    return (
        <div>
            {/* <Home state={"usermanage"}> */}
            {/* <button className="btn btn-primary" onClick={debug}>debug</button> */}
            {role ?
                <div>
                    <div>
                        <div className="h4 text-light">User Management<span className="h6 m-2">จัดการผู้ใช้งานระบบ</span></div>
                        <div>
                            <div className="text-end my-2 me-2">
                                <button className="btn btn-sm btn-primary" onClick={() => { setTitleModal("เพิ่มผู้ใช้งานระบบ"); setDataInfo([]); setOpt(true); setEnableBtn(false); }} data-bs-toggle="modal" data-bs-target="#modal-dialog"><i className="fa fa-plus me-2"></i>เพิ่ม</button>
                            </div>

                            <div>
                                <table className="table table-sm table-hover text-center">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>ชื่อผู้ใช้</th>
                                            <th>email</th>
                                            <th>ชื่อ</th>
                                            <th>level</th>
                                            <th>เบอร์โทร</th>
                                            <th>ที่อยู่</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataUser.length > 0 ?
                                            dataUser.map((e, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{e.user}</td>
                                                        <td>{e.email}</td>
                                                        <td>{e.name}</td>
                                                        <td>{e.level}</td>
                                                        <td>{e.phone}</td>
                                                        <td>{e.address}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#modal-dialog" onClick={() => { setTitleModal("แก้ไขข้อมูล"); setDataInfo(e); setEnableBtn(false); }} title="แก้ไขข้อมูล"><i className="fa fa-pencil"></i></button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => { handleDelete(e) }} title="ลบข้อมูล"><i className="fa fa-times"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td></td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* -- modal -- */}
                    <div className="modal fade" id="modal-dialog" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{titleModal}</h5>
                                    <button id="btn-close-modalInfo" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div id="modalbody" className="modal-body">
                                    <div className="input-group mb-2">
                                        <label htmlFor="user" className="input-group-text">ชื่อผู้ใช้</label>
                                        <input id="user" className="form-control" placeholder="ป้อนชื่อบัญชีผู้ใช้" value={dataInfo.user !== undefined ? dataInfo.user : ""} onChange={(e) => { setDataInfo({ ...dataInfo, user: e.target.value }); setEnableBtn(true) }} >
                                        </input>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="email" className="input-group-text">Email</label>
                                        <input id="email" className="form-control" type="email" placeholder="ป้อนอีเมล์" value={dataInfo.email !== undefined ? dataInfo.email : ""} onChange={(e) => { setDataInfo({ ...dataInfo, email: e.target.value }); setEnableBtn(true); }}></input>
                                    </div>

                                    {dataInfo.id !== undefined ? "" :
                                        <div>
                                            <div className="input-group mb-2 mt-4">
                                                <label htmlFor="password" className="input-group-text">Password</label>
                                                <input id="password" className="form-control" type="password" value={dataInfo.pwd !== undefined ? dataInfo.pwd : ""} onChange={(e) => { setDataInfo({ ...dataInfo, pwd: e.target.value }); setEnableBtn(true); }} placeholder="ป้อนรหัสผ่าน">
                                                </input>
                                            </div>
                                            <div className="input-group">
                                                <label htmlFor="confirmpassword" className="input-group-text">Confirm Password</label>
                                                <input id="confirmpassword" className="form-control" type="password" value={confirmPwd !== undefined ? confirmPwd : ""} onChange={(e) => { setConfirmPwd(e.target.value); setEnableBtn(true); }} placeholder="ยืนยันรหัสผ่าน">
                                                </input>
                                            </div>
                                        </div>
                                    }

                                    <div className="input-group mb-2 mt-4">
                                        <label htmlFor="name" className="input-group-text">ชื่อ-สกุล</label>
                                        <input id="name" className="form-control" placeholder="ป้อนชื่อผู้ใช้" value={dataInfo.name !== undefined ? dataInfo.name : ""} onChange={(e) => { setDataInfo({ ...dataInfo, name: e.target.value }); setEnableBtn(true); }}></input>
                                    </div>
                                    <div className="input-group mb-2">
                                        <label htmlFor="phone" className="input-group-text">เบอร์โทร</label>
                                        <input id="phone" className="form-control" placeholder="ป้อนหมายเลขโทรศัพท์" value={dataInfo.phone !== undefined ? dataInfo.phone : ""} onChange={(e) => { isNaN(e.target.value) ? setDataInfo({ ...dataInfo, phone: "" }) : setDataInfo({ ...dataInfo, phone: e.target.value }); setEnableBtn(true); }}></input>
                                    </div>
                                    <div className="input-group mb-4">
                                        <label htmlFor="address" className="input-group-text">ที่อยู่</label>
                                        <input id="address" className="form-control" placeholder="ป้อนที่อยู่" value={dataInfo.address !== undefined ? dataInfo.address : ""} onChange={(e) => { setDataInfo({ ...dataInfo, address: e.target.value }); setEnableBtn(true); }}></input>
                                    </div>
                                    <div className="input-group mb-2">
                                        <label htmlFor="level" className="input-group-text">สิทธิ์ผู้ใช้งาน</label>
                                        <select id="level" className="form-select" onClick={() => { setOpt(false); setEnableBtn(true); }} value={dataInfo.level !== undefined ? dataInfo.level : ""} onChange={(e) => { setDataInfo({ ...dataInfo, level: e.target.value }) }}>
                                            <option disabled={opt ? "" : "disabled"}>กำหนดสิทธิ์ผู้ใช้งาน</option>
                                            {level.map((e, i) => {
                                                return (
                                                    <option key={i} value={e}>{e}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="text-center mb-4">
                                    <button className="btn btn-danger" data-bs-dismiss="modal" title="ยกเลิก">
                                        <i className="fa fa-times me-2"></i>ยกเลิก
                                    </button>
                                    <button className="btn btn-success mx-2" title="ตกลง" onClick={handleSave} disabled={enableBtn ? "" : "disabled"}>
                                        <i className="fa fa-check me-2"></i>ตกลง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* -- end modal -- */}
                </div>
                :
                <div>
                    <h3 className="text-light">กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแล</h3>
                </div>
                }
            {/* </Home> */}
        </div>
    )
}

export default UserManage;