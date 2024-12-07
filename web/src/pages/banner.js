import { useEffect, useState } from "react";
// import Home from "./home";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";

function Banner() {
    const initBanner = {
        id: '',
        createdDate: '',
        name: '',
        src: null,
        type: '',
        size: ''
    }
    const initPosition = {
        id: '',
        page: '',
        position: '',
        bannerPath: null,
        expDate: ''
    }
    const [fileUpload, setFileUpload] = useState();
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([initBanner]);
    const [positiondata, setPositionData] = useState([]);
    const [statusMessage, setStatusMessage] = useState('null');
    const [addPosition, setAddPosition] = useState({});
    const [positionInfo, setPositionInfo] = useState();
    // const [positionInfo, setPositionInfo] = useState(initPosition);
    const [preEditPosition, setPreEditPosition] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/banner/list')
            const resPosiotion = await axios.get(config.apiPath + '/api/banner/positionlist')
            if (res.data.data && resPosiotion.data.data) {
                setData(res.data.data)
                setPositionData(resPosiotion.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    } // end fetchData

    const allowType = (item) => {
        const fileType = ['image/webp', 'image/jpeg', 'image/png']

        if (!fileType.includes(item.type)) {
            throw new Error('*ประเภทไฟล์รูปภาพไม่ถูกต้อง กรุณาเลือกใหม่อีกครั้ง')
        }
    } // end allowType

    const handleAddPosition = async () => {
        try {
            const payload = addPosition
            const res = await axios.post(config.apiPath + '/api/banner/addposition', payload)
            if (res.data.state === "success") {
                fetchData()
            } else {
                console.log(res.data)
            }

            closeModale();

        } catch (err) {
            console.log(err)
        }
    } // end handleAddPosition

    const handleEditPositioin = async () => {
        try {
            const payload = preEditPosition
            const res = await axios.put(config.apiPath + '/api/banner/editposition', payload)
            if (res.data) {
                Swal.fire({
                    title: "บันทึกตำแหน่งแบนเนอร์เรียบร้อย",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000
                })
                setPreEditPosition([])
            }
        } catch (err) {
            console.log(err)
        }
    } // handleEditPositioin

    const onChange = (item) => {
        try {
            if (item.target.files[0] !== undefined) {
                const file = item.target.files[0]
                allowType(file)
            }
            setFileUpload(item.target.files[0])
            setStatusMessage('null')
        } catch (err) {
            setFileUpload();
            console.log(err.message)
            setStatusMessage(err.message)
        }
    } // end onChange

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append('myfile', fileUpload)
            // formData.append('myfile', fileUpload, fileUpload.name)
            const res = await axios.post(config.apiPath + '/api/banner/upload', formData)
            if (res.data.describe) {
                Swal.fire({
                    title: 'บันทึกรูปภาพเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 1500,
                })
                fetchData()
                setInputValue('')
            }
        } catch (err) {
            console.log(err)
            Swal.fire({
                title: 'Error',
                text: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง',
                icon: 'error',
            })
        }
    } // end handleUpload

    const deleteImage = async (item) => {
        try {
            const res = await axios.delete(config.apiPath + '/api/banner/delete/' + item.id)
            return res
        } catch (err) {
            return { state: 'error', message: err }
        }
    } // end deleteImage

    const deletePosition = async (item) => {
        try {
            const res = await axios.delete(config.apiPath + '/api/banner/deleteposition/' + item.id)
            return res
        } catch (err) {
            return { state: 'error', message: err }
        }
    } // end deletePosition

    const handleDelete = async (e, item) => {
        try {
            await Swal.fire({
                title: "ยืนยันการลบ",
                html: "ต้องการลบข้อมูลนี้หรือไม่<br>ข้อมูลจะไม่สามารถกู้คืนกลับมาได้อีก",
                icon: "warning",
                showCancelButton: true,
            }).then(async (res) => {
                if (res.isConfirmed) {
                    let res;
                    if (e === 'banner') {
                        res = await deleteImage(item)
                    } else if (e === 'position') {
                        res = await deletePosition(item)
                    }

                    if (res.data.state === 'success') {
                        Swal.fire({
                            title: 'ลบข้อมูลเรียบร้อยแล้ว',
                            icon: 'success',
                            timer: 1500,
                        })
                        fetchData()
                    } else if (res.state === 'error') {
                        console.log(res.message)
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    } // end handleDelete

    const bannerPath = (item) => {
        if (item !== null) {
            const path = config.apiPath + item
            return path
        }
        return null
    } // end bannerPath

    const setupPositionInfo = (arr, item) => {
        return new Promise((resolve) => {
            arr = ({ ...arr, bannerPath: item.src })
            resolve(arr)
        })
    }

    const addBannerPositionToArr = async (item) => {
        const newPosition = await setupPositionInfo(positionInfo, item)

        // หาตำแหน่ง index ของ positiondata เพื่อเปลี่ยนค่า bannerPath
        const index = positiondata.findIndex((e) => e.id === newPosition.id)
        // เปลี่ยนค่าใน positiondata เพื่อให้หน้าเพจอัพเดทข้อมูลรูปภาพ
        positiondata[index] = newPosition


        // ตรวจสอบว่ามีข้อมูลในอาร์เรย์อยู่หรือไม่
        if (preEditPosition.length > 0) {
            // ตรวจสอบว่าข้อมูลใน newPosition มีข้อมูลอยู่ในอาร์เรย์หรือไม่
            const iPre = preEditPosition.findIndex((e) => e.id === newPosition.id)
            if (iPre === -1) {
                setPreEditPosition([...preEditPosition, newPosition])
            } else {
                preEditPosition[iPre].bannerPath = newPosition.bannerPath
            }
        } else {
            setPreEditPosition([...preEditPosition, newPosition])
        }

        // spread array ทำให้เกิดการรีเฟรซรูปภาพ
        setPositionData([...positiondata])
        closeModale();
    } // end addBannerPositionToArr

    const closeModale = () => {
        document.getElementById("btn-close-modalShowBanner").click();
        document.getElementById("btn-close-modalAddPosition").click();
    } // end closeModale

    const debug = (item) => {
        console.log('data : ' ,data)
    }

    return (
        <div>
            {/* <Home state={"banner"}> */}
            <div>
                <button className="btn btn-primary" onClick={debug}>debug</button>
                <div className="h4 text-light mb-4">Banner Management</div>
                <div>
                    <div className="alert alert-primary">
                        <form onSubmit={handleUpload}>
                            <span className="fs-12px ms-2 mb-2">Image size : 100 x 600 px</span>
                            <div className={statusMessage === 'null' ? "input-group" : "input-group is-invalid"}>
                                <input id="fileupload" type="file" className={statusMessage === 'null' ? "form-control border border-2 border-primary" : "form-control border border-2 border-primary is-invalid"} value={inputValue} onChange={(e) => { onChange(e); setInputValue(e.target.value); }} accept="image/webp, image/jpeg, image/png" title="file upload"></input>
                                <button className="btn btn-primary" type="submit" disabled={fileUpload === undefined ? 'disabled' : ''}><i className="fa fa-upload me-2"></i>Upload</button>
                            </div>
                            <span className="invalid-feedback fs-12px ms-2 mt-2">{statusMessage}</span>
                            <div className="mt-3 ms-2">
                                {fileUpload ?
                                    <img src={URL.createObjectURL(fileUpload)} alt="ตัวอย่างรูปภาพ" style={{ height: "50px" }}></img>
                                    : ""
                                }
                                {/* <img src={fileUpload ? URL.createObjectURL(fileUpload) : ""} alt="ตัวอย่างรูปภาพ" style={{ width: "600px", height: "100px" }}></img> */}
                                {/* <img src="./favicon2.ico"></img> */}
                            </div>
                        </form>
                    </div>
                </div>

                {/* -- เลือกตำแหน่งแบนเนอร์ -- */}
                <div>
                    <div className="d-flex justify-content-between align-items-end">
                        <p className="m-0 ms-2 text-light">จัดตำแหน่งแบนเนอร์</p>
                        <div>
                            <button className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#banner-modal-add-position">
                                <i className="fa fa-plus me-2"></i>เพิ่มตำแหน่ง
                            </button>
                            <button className="btn btn-sm btn-success" onClick={handleEditPositioin} disabled={preEditPosition.length > 0 ? "" : "disabled"}>
                                บันทึกตำแหน่ง
                            </button>
                        </div>
                    </div>
                    <table className="table text-center mt-2">
                        <thead className="table-secondary">
                            <tr>
                                <th>หน้าเพจ</th>
                                <th>ตำแหน่ง</th>
                                <th>exp.Date</th>
                                <th>รูปภาพ</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positiondata.length > 0 ?
                                positiondata.map((e, i) => {
                                    const src = bannerPath(e.bannerPath)
                                    return (
                                        <tr key={i}>
                                            <td>{e.page}</td>
                                            <td>{e.position}</td>
                                            <td>{e.expDate}</td>
                                            <td>
                                                {src !== null ?
                                                    <img src={src} alt="img" height={50} className="tr-cursor" data-bs-toggle="modal" data-bs-target="#modal-banner" onClick={() => setPositionInfo(e)}></img>
                                                    : <button className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#modal-banner" onClick={() => setPositionInfo(e)} >เลือกรูปภาพจากคลัง</button>
                                                }

                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete('position', e)}>
                                                    <i className="fa fa-times me-2"></i>ลบตำแหน่ง
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td>No data</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                {/* -- สิ้นสุด เลือกตำแหน่งแบนเนอร์ -- */}

                {/* -- รายการแบนเนอร์ทั้งหมด -- */}
                <div className="mt-4">
                    <p className="m-0 ms-2 text-light">รายการแบนเนอร์ทั้งหมด</p>
                    <table className="table table-hover text-center mt-2">
                        <thead className="table-secondary">
                            <tr>
                                <th>รูปภาพ</th>
                                <th>ชื่อ</th>
                                <th>Type</th>
                                <th>ขนาด (Byte)</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ?
                                data.map((e, i) => {
                                    const src = bannerPath(e.src)
                                    return (
                                        <tr key={i}>
                                            <td><img src={src} alt="img" height={50}></img></td>
                                            <td>{e.name}</td>
                                            <td>{e.type}</td>
                                            <td>{e.size.toLocaleString('th-TH')}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete('banner', e)}>
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td>"no data"</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                {/* -- สิ้นสุด รายการแบนเนอร์ทั้งหมด -- */}

            </div >

            {/* -- modal add position -- */}
            <div className="modal fade" id="banner-modal-add-position" tabIndex="-1">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">เพิ่มตำแหน่งแสดงแบนเนอร์</h5>
                            <button id="btn-close-modalAddPosition" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div id="modalbody" className="modal-body">
                            <div className="input-group mb-2">
                                <label htmlFor="page" className="input-group-text">หน้าเพจ</label>
                                <input id="page" className="form-control" placeholder="ป้อนหน้าเพจ" onChange={(e) => setAddPosition({ ...addPosition, page: e.target.value })}>
                                </input>
                            </div>
                            <div className="input-group mb-2">
                                <label htmlFor="position" className="input-group-text">ตำแหน่ง</label>
                                <input id="position" className="form-control" placeholder="ป้อนตำแหน่ง" onChange={(e) => setAddPosition({ ...addPosition, position: e.target.value })}>
                                </input>
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <button className="btn btn-danger" data-bs-dismiss="modal" title="ยกเลิก">
                                <i className="fa fa-times me-2"></i>ยกเลิก
                            </button>
                            <button className="btn btn-success mx-2" title="ตกลง" onClick={handleAddPosition}>
                                <i className="fa fa-check me-2"></i>ตกลง
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {/* -- end modal add position -- */}

            {/* -- modal show banner -- */}
            <div className="modal fade" id="modal-banner" tabIndex="-1">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">เลือกแบนเนอร์ที่ต้องการ</h5>
                            <button id="btn-close-modalShowBanner" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div id="modalbody" className="modal-body">
                            {data.length > 0 ?
                                data.map((e, i) => {
                                    const src = bannerPath(e.src)
                                    return (
                                        <img key={i} src={src} alt="img" height={50} className="my-1" onClick={() => { addBannerPositionToArr(e) }}></img>
                                    )
                                }) :
                                <div>ไม่พบรูปภาพในคลัง</div>
                            }

                            <div>
                                <hr></hr>
                                <button className="btn btn-sm btn-danger" onClick={() => addBannerPositionToArr(initBanner)} disabled={positionInfo?.bannerPath ? "" : "disabled"}>
                                {/* <button className="btn btn-sm btn-danger" onClick={() => addBannerPositionToArr(initBanner)} disabled={positionInfo.bannerPath ? "" : "disabled"}> */}
                                    <i className="fa fa-times me-2"></i>ลบรูปภาพออกจากตำแหน่งนี้
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* -- end modal show banner -- */}
            {/* </Home > */}
        </div >
    )
}

export default Banner;