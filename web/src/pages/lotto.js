import axios from "axios";
// import Home from "./home";
import { useState, useEffect, useRef } from "react";
import config from "../config";
import alertBox from "sweetalert2";
import Tablelotto from "./table-lotto";
// import dayjs from "dayjs"

function Lotto() {
    const [id, setId] = useState(0);
    const [number, setNumber] = useState('');
    // const [roundDate, setRounddate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
    const [roundDate, setRounddate] = useState('');
    const [bookNumber, setBooknumber] = useState('');
    const [cost, setCost] = useState('');
    const [sale, setSale] = useState('');
    const [stock, setStock] = useState('');
    const [data, setData] = useState();
    const myRef = useRef();

    const payload = {
        l_number: number,
        roundDate: roundDate,
        bookNumber: parseInt(bookNumber),
        cost: parseInt(cost),
        sale: parseInt(sale),
        stock: parseInt(stock),
        all_stock: parseInt(stock),
    };

    useEffect(() => {
        // focusInput();
        fetchData();
    }, []);

    const focusInput = () => {
        setTimeout(() => {
            myRef.current.focus();
            myRef.current.select();
        }, 1300);
    } // delay รอให้กล่องแจ้งเตือนแสดงจนเสร็จ เพื่อ cursorโฟกัสกล่องข้อความอีกครั้ง

    const clearInput = () => {
        setNumber('');
        // setRounddate('');
        setBooknumber('');
        setCost('');
        setSale('');
        setStock('');
        setId(0);
        focusInput();
    } // end clearInput

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + "/api/lotto/list").then((res) => {
                if (res.data.length > 0) {
                    setData(res.data);
                }
            }).catch((err) => {
                console.log(err);
            })
        } catch (e) {
            alertBox.fire({
                title: "Error..!!",
                text: e,
                icon: "error",
            })
            console.log(e);
        }
    } // end fetchdata

    const Save = async () => {
        try {
            await axios.post(config.apiPath + "/api/lotto/create", payload).then((res) => {
                if (res.data.id !== undefined) {
                    alertBox.fire({
                        title: "Complate",
                        text: "บันทึกข้อมูลเสร็จสมบูรณ์",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000
                    })
                    fetchData();
                    clearInput();
                    focusInput();
                } else {
                    console.log(res.data);
                };
            }).catch((e) => {
                alertBox.fire({
                    title: "Error",
                    text: e.message,
                    icon: "error",
                })
            })
        } catch (e) {
            alertBox.fire({
                title: "Invalid",
                text: e.message,
                icon: "error",
            })
        }
    } // end save

    const inItem = (item) => {
        if (item !== undefined) {
            setNumber(item.l_number);
            // setRoundnumber(item.roundNumber);
            setRounddate(item.roundDate);
            setBooknumber(item.bookNumber);
            setCost(item.cost);
            setSale(item.sale);
            setStock(item.stock);
            setId(item.id);
        };
    } // รับค่ามาจาก table-lotto.js แล้วแก้ไขค่าใน useState เพื่อแก้ไขข้อมูล

    const Edit = async () => {
        try {
            await axios.put(config.apiPath + "/api/lotto/edit/" + id, payload).then((res) => {
                if (res.data.id !== undefined) {
                    alertBox.fire({
                        title: "Complate",
                        text: "บันทึกข้อมูลเสร็จสมบูรณ์",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000
                    })
                    fetchData();
                    clearInput();
                    focusInput();
                } else {
                    console.log(res.data);
                };
            })
        } catch (e) {
            alertBox.fire({
                title: "Invalid",
                text: e.message,
                icon: "error",
            })
        }
    } // end edit

    const trxData = (trx) => {
        if (trx === "Req") {
            fetchData();
            console.log("refresh table");
        }
    } // รับค่าร้องขอการรีค่าตาราง

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (id !== 0) {
                Edit();
            } else if (id === 0) {
                Save();
            } else {
                console.log("ไม่เข้าเงื่อนไข Edit และ Save");
            }
        } catch (e) {
            alertBox.fire({
                title: "Invalid",
                text: e,
                icon: "error",
            })
        }
    }; // end handleSave

    // const showDebug = () => {
    //     console.log(dayjs(roundDate).format("DD-MM-YYYY"))
    // }

    return (
        <div>
            {/* <Home state={"lotto"}> */}
                {/* <button onClick={showDebug}>click debug</button> */}
                {/* เพิ่มข้อมูลสลาก */}
                <div className="h4 text-light">Manage <span className="h6">จัดการสลาก</span></div>
                <div className="alert alert-primary text-center">
                    <form onSubmit={handleSave} onReset={clearInput} className="row align-items-center">

                        <div className="col-12 row p-0 m-0">
                            <div className="col-4">
                                <div className="input-group">
                                    <label htmlFor="rounddate" className="input-group-text">งวดวันที่</label>
                                    <input id="rounddate" onChange={e => { setRounddate(e.target.value) }} type="date" className="form-control text-center" value={roundDate} required ></input>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="input-group">
                                    <label htmlFor="number" className="input-group-text">เลข</label>
                                    <input id="number" ref={myRef} onChange={e => setNumber(e.target.value)} className="form-control text-center" value={number} required ></input>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="input-group">
                                    <label htmlFor="stock" className="input-group-text">จำนวน (ใบ)</label>
                                    <input id="stock" onChange={e => setStock(e.target.value)} className="form-control text-center" value={stock} required ></input>
                                    <label htmlFor="stock" className="input-group-text">ใบ</label>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 row mt-2 p-0 m-0 justify-content-between">
                            <div className="col-9 row">
                                <div className="col-3">
                                    <div className="input-group input-group-sm">
                                        <label htmlFor="booknumber" className="input-group-text">เล่มที่</label>
                                        <input id="booknumber" onChange={e => setBooknumber(e.target.value)} className="form-control text-center" value={bookNumber} required ></input>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="input-group input-group-sm">
                                        <label htmlFor="cost" className="input-group-text">ต้นทุน</label>
                                        <input id="cost" onChange={e => setCost(e.target.value)} className="form-control text-center" value={cost} required ></input>
                                        <label htmlFor="cost" className="input-group-text">บาท</label>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="input-group input-group-sm">
                                        <label htmlFor="sale" className="input-group-text">ราคา</label>
                                        <input id="sale" onChange={e => setSale(e.target.value)} className="form-control text-center" value={sale} required ></input>
                                        <label htmlFor="sale" className="input-group-text">บาท</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3 text-end">
                                <button type="submit" className="btn btn-sm btn-primary me-2 px-4"><i className="fa fa-check me-2"></i>SAVE</button>
                                <button type="reset" className="btn btn-sm btn-outline-secondary px-4"><i className="fa fa-rotate-left me-2"></i>Reset</button>
                            </div>

                        </div>
                    </form>
                </div>
                {/* จบ เพิ่มข้อมูลสลาก */}

                {/* ตารางรายการสลาก */}
                <Tablelotto data={data} transItem={inItem} reqData={trxData} />
                {/* จบ ตารางรายการสลาก */}

            {/* </Home> */}
        </div>
    )
}

export default Lotto;