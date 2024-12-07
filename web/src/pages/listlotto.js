import { useEffect, useState, useRef } from "react";
import config from "../config";
import alertBox from "sweetalert2";
import axios from "axios";

function Listlotto(props) {
    const [data, setData] = useState();
    const [inp1, setInp1] = useState('');
    const [inp2, setInp2] = useState('');
    const [inp3, setInp3] = useState('');
    const [inp4, setInp4] = useState('');
    const [inp5, setInp5] = useState('');
    const [inp6, setInp6] = useState('');
    const [load, setLoad] = useState(false); // หากมีค่าเป็น false แอพสามารถเรียกใช้ fetchData ได้
    const { reloadpage } = props
    // const [debug, setDebug] = useState();

    const focus2 = useRef();
    const focus3 = useRef();
    const focus4 = useRef();
    const focus5 = useRef();
    const focus6 = useRef();
    const focusbtn = useRef();

    useEffect(() => {
        fetchData();
        setLoad(true);
    }, [reloadpage]) // end useEffect

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + "/api/lotto/list").then((res) => {
                if (res.data.length > 0) {
                    setData(res.data);
                    // console.log(res.data)
                }
                // console.log(res.data)
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
                title: "Error..!!",
                text: e,
                icon: "error",
            })
        }
    } // end fetchData

    const inputchange = (e, v) => {
        isNaN(v) ? v = "" : console.log("false is number : " + v); // เช็คค่า v ว่าไม่ใช่ตัวเลข เป็นจริงให้ v เป็นค่าว่าง

        switch (e) {
            case 1: {
                setInp1(v)
                return v !== "" ? focus2.current.focus() : ""; // ถ้า v ไม่เท่ากับค่าว่าง ให้ไปทำงานที่ช่องถัดไป
            }
            case 2: {
                setInp2(v)
                return v !== "" ? focus3.current.focus() : "";
            }
            case 3: {
                setInp3(v)
                return v !== "" ? focus4.current.focus() : "";
            }
            case 4: {
                setInp4(v)
                return v !== "" ? focus5.current.focus() : "";
            }
            case 5: {
                setInp5(v)
                return v !== "" ? focus6.current.focus() : "";
            }
            case 6: {
                setInp6(v)
                return focusbtn.current.focus();
            }
            default: return alert("plaes insert value")
        }
    } // end inputchange

    const search = async (payload) => {
        try {
            await axios.post(config.apiPath + "/api/lotto/search", payload)
                .then((res) => {
                    if (res.data.length > 0) {
                        setData(res.data);
                        // console.log(res)
                    } else {
                        alertBox.fire({
                            title: "ไม่พบสลาก..!!",
                            text: "ไม่พบเลขที่ต้องการ หรือสินค้าหมดแล้ว",
                            icon: "error",
                        })
                        console.log("ไม่พบข้อมูล")
                    }
                    console.log(res.data)
                })
                .catch((err) => {
                    alertBox.fire({
                        title: "Invalid..!!",
                        text: err.message,
                        icon: "error",
                    })
                    console.log(err);
                })
        } catch (e) {
            alertBox.fire({
                title: "Error..!!",
                text: e,
                icon: "error",
            })
        }
    } // end search

    const searchlotto = async () => {
        if (inp1 === "" && inp6 === "") {
            alertBox.fire({
                title: "Invalid Value",
                text: "กรุณาป้อนเลขหน้าหรือเลขท้ายให้ถูกต้อง เพื่อทำการค้นหา..",
                icon: "error",
            })
            return false;
        }

        const position = inp6 === "" ? "start" : "end";
        let number = inp1 + inp2 + inp3 + inp4 + inp5 + inp6;
        const payload = { position, number };

        search(payload); // call search()
        setLoad(false);
    } // end searchlotto

    const clear = () => {
        setInp1('');
        setInp2('');
        setInp3('');
        setInp4('');
        setInp5('');
        setInp6('');
    } // end clear

    const isload = () => {
        if (!load) {
            fetchData();
            setLoad(true);
        }
    } // เช็คค่าก่อนเรียก fetchDat()

    const addtoCart = (item) => {
        props.orderSent({ item, Qty: 1 });
        // const { id, l_number, roundNumber, bookNumber, cost, sale, stock}=item
        // const lotto={ id, l_number, roundNumber, bookNumber, cost, sale, stock,Qty:1}
        // setDebug({ item, Qty: 1 });
        // console.log(lotto)
    } // end addtoCart

    // const showDebug = () => {
    //     // setReload(!reload)
    //     console.log(props.reload)
    // }

    return (
        <div className="bg-opacity-50 rounded-bottom pb-4">
            {/* --- ค้นหา --- */}
            <div className="container text-center py-4">
                <h6 style={{letterSpacing: "5px"}} className="text-light">ค้นหาเลขสลาก</h6>
                {/* <button className="btn btn-primary" onClick={showDebug}>click debug</button> */}
                <div className="col-8 col-md-6 mx-auto d-flex justify-content-between">
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center"
                            onChange={(e) => { inputchange(1, e.target.value) }} value={inp1} onFocus={() => { setInp1('') }} />
                    </div>
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center" ref={focus2}
                            onChange={(e) => { inputchange(2, e.target.value) }} value={inp2} onFocus={() => { setInp2('') }} />
                    </div>
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center" ref={focus3}
                            onChange={(e) => { inputchange(3, e.target.value) }} value={inp3} onFocus={() => { setInp3('') }} />
                    </div>
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center" ref={focus4}
                            onChange={(e) => { inputchange(4, e.target.value) }} value={inp4} onFocus={() => { setInp4('') }} />
                    </div>
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center" ref={focus5}
                            onChange={(e) => { inputchange(5, e.target.value) }} value={inp5} onFocus={() => { setInp5('') }} />
                    </div>
                    <div className="col-2">
                        <input className="col-10 h4 rounded border-light text-bg-light text-center" ref={focus6}
                            onChange={(e) => { inputchange(6, e.target.value) }} value={inp6} onFocus={() => { setInp6('') }} />
                    </div>
                </div>
                <div className="text-center mt-2">
                    <button className="btn btn-outline-light btn-sm me-2" onClick={() => { clear(); isload(); }} ><i className="fa fa-rotate-left me-2"></i>ล้างข้อมูล</button>
                    <button className="btn btn-primary btn-sm" ref={focusbtn} onClick={searchlotto}><i className="fa fa-search me-2"></i>ค้นหา</button>
                </div>
            </div>
            {/* --- สิ้นสุดช่องค้นหา --- */}

            {/* --- รายการสลาก --- */}
            <div className="container text-center">
                <div className="row">
                    {data !== undefined ?
                        data.map((e, i) => {
                            if (e.stock > 0) {
                                return (
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
                                        <div className="card bg-light border-primary text-bg-light my-2 shadow-sm">
                                            <div className="card-body">
                                                <div>
                                                    <div style={{ letterSpacing: "5px" }} className="h2 text-primary fw-bold">{e.l_number}</div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="fw-light text-secondary">คงเหลือ {e.stock} ใบ</div>
                                                    <div className="h4">{e.sale} บาท</div>
                                                </div>

                                                <div className="mt-2">
                                                    <button className="btn btn-outline-success btn-sm" onClick={() => { addtoCart(e) }}>
                                                        <i className="fa fa-shopping-basket me-2"></i>เพิ่มลงตะกร้า</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        }) : "Network error"}
                </div>
            </div>
            {/* --- สิ้นสุดรายการแสดงสลาก --- */}

        </div>
    )
}

export default Listlotto;