import { useEffect, useState } from "react";
import Listlotto from "./listlotto";
import Ordercart from "./ordercart";
import ico from "./favicon2.ico";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";

function Index() {
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState('listlotto');
    const [reload, setReload] = useState(false);
    const [float, setFloat] = useState(false);
    const [banner, setBanner] = useState([]);
    const [userName, setUserName] = useState('false');
    const [floatUser, setFloatUser] = useState(false);
    let total = 0;
    let QtyAll = 0;

    useEffect(() => {
        fetchUserInfo()
        fetchBanner()
    }, [])

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/user/info', config.headers())
            if (res.data.payload !== undefined) {
                setUserName(res.data.info.name)
            } else {
                setUserName('false')
            }
            // console.log(res.data.payload)
        } catch (err) {
            console.log(err)
        }
    } // end fetchUserInfo

    const setupPositionBanner = (item) => {
        return new Promise((resolve) => {
            let path = {}
            const dummyPath = '/uploads/df8481e9597812620d419a618f5a7258.jpg'
            for (const e of item) {
                if (e.page === 'index' && e.bannerPath !== null) {
                    switch (e.position) {
                        case '1': { path.position1 = config.apiPath + e.bannerPath; break; }
                        case '2': { path.position2 = config.apiPath + e.bannerPath; break; }
                        case '3': { path.position3 = config.apiPath + e.bannerPath; break; }
                        case '4': { path.position4 = config.apiPath + e.bannerPath; break; }
                        default: break;
                    }
                } else if (e.page === 'index' && e.bannerPath === null) {
                    switch (e.position) {
                        case '1': { path.position1 = config.apiPath + dummyPath; break; }
                        case '2': { path.position2 = config.apiPath + dummyPath; break; }
                        case '3': { path.position3 = config.apiPath + dummyPath; break; }
                        case '4': { path.position4 = config.apiPath + dummyPath; break; }
                        default: break;
                    }
                }
            }
            resolve(path)
        })
    } // end setupPositionBanner

    const fetchBanner = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/banner/positionlist')
            if (res.data.data) {
                // setBanner(res.data.data)
                // console.log(res.data.data)
                const bannerPath = await setupPositionBanner(res.data.data)
                setBanner(bannerPath)
            }
        } catch (err) {
            console.log(err)
        }
    } // end fetchBanner

    const orderIn = (item) => {
        if (userName === 'false') {
            Swal.fire({
                title: 'Pleas log in',
                text: 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ',
                icon: 'warning',
                timer: 5000
            })
            console.log('not login')
            return false;
        }
        const i = cart.findIndex(e => e.item.id === item.item.id) //ค้นหาไอดีว่ามีอยู่แล้วหรือไม่
        if (i === -1) {
            setCart([item, ...cart])
        } else {
            const Qty = cart[i].Qty
            const stock = cart[i].item.stock
            // หากจำนวนสั่งซื้อมากกว่าสต๊อก ไม่ต้องเพิ่มข้อมูลใดๆ
            if (stock > Qty) {
                cart[i].Qty += 1
                // cart.splice(i, 1, item)
            }
            setCart([...cart])
        }
        // console.log(item)
    } // end orderIn

    const cartChange = (index, value) => {
        cart[index].Qty = value
        setCart([...cart])
        // console.log()
    }

    const orderRemove = (index) => {
        if (index !== "clear") {
            cart.splice(index, 1)
            setCart([...cart])
        } else {
            setCart([])
        }
    } // end orderRemove

    const orderShow = () => {
        console.log(cart);
        // console.log(cart.length);
    }

    const pageChange = (e) => {
        setPage(e);
        if (e === "reloadlistlotto") {
            setReload(!reload)
        }
    }

    const handleLogout = () => {
        // localStorage.removeItem('lottoToken')
        // window.location.reload()
        config.handleLogout();
    }

    // const showDebug = () => {
    //     console.log(banner.position1)
    //     console.log(banner.position2)
    //     console.log(banner.position3)
    //     console.log(banner.position4)
    // }

    return (
        <div>
            {/* <button className="btn btn-primary" onClick={showDebug}>debug</button> */}
            {/* -- แท็ปนำทาง -- */}
            <div id="navbar-ontop" className="container-fluid bg-warning">
                <div id="top-navbar" className="container-xl text-end fs-12px py-1">

                    <div className="d-inline me-3">

                        {userName === 'false' ?
                            <div className="d-inline">
                                <Link to="/login" className="text-dark" title="เข้าสู่ระบบ">เข้าสู่ระบบ</Link>
                            </div>
                            :
                            <div className="d-inline" onMouseOver={() => setFloatUser(true)} onMouseLeave={() => setFloatUser(false)}>
                                <div style={{ position: "relative" }} className="d-inline">
                                    <Link to="#" className="badge bg-success fs-14px">
                                        <i className="fa fa-user me-1"></i>
                                        <span className="">{userName}</span>
                                    </Link>

                                    <div style={{ position: "absolute" }} className={floatUser ? "float-user" : "hidden"}>
                                        <div className="arrow-order">
                                            <div className="arrow"></div>
                                        </div>
                                        <div className="card shadow">
                                            <div className="card-body p-1">
                                                <ul className="profilebox">
                                                    <li className="pe-3 fs-14px"><Link to="#"><span>ข้อมูลส่วนตัว</span></Link></li>
                                                    <li className="pe-3 fs-14px"><Link to="#"><span>ประวัติการซื้อ</span></Link></li>
                                                    <li className="pe-3 fs-14px"><Link to="#" onClick={handleLogout}><span>ออกจากระบบ</span></Link></li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        }

                    </div>

                    {/* <div className="d-inline me-3" title="ประวัติการซื้อ"><Link to="#" className="text-dark">การซื้อของฉัน</Link></div> */}
                    <div className="d-inline me-3" title="เข้าสู่ระบบหลังบ้าน"><Link to="/home" className="text-dark">Back office</Link></div>
                    <div className="d-inline me-3" title="ตรวจสอบรางวัล"><Link to="/reward" target="_blank" className="text-dark">ผลรางวัล</Link></div>
                </div>
            </div>
            {/* -- แท็ปโลโก้ -- */}
            <div id="topbar" className="container-fluid bg-dark p-0 sticky-top">
                <div className="container-xl text-bg-dark rounded-bottom px-4">
                    <div className="row">
                        <div className="col-4 col-md-1 col-xl-3 my-auto text-end pe-0" title="Lotto Agent">
                            <img src={ico} alt="icon" style={{ width: "45px", cursor: "pointer" }} className="bg-dark" onClick={() => { pageChange('listlotto') }} />
                        </div>
                        <div className="d-none d-md-block col-6 col-md-8 col-lg-6 text-center" title="Lotto Agent">
                            <h1 style={{ cursor: "pointer", letterSpacing: "0.5em" }} className="text-warning bg-dark" onClick={() => { pageChange('listlotto') }}>LOTTO AGENT</h1>
                        </div>

                        {/* -- cart -- */}
                        <div style={{ position: "relative" }} className="col-8 col-md-3 col-lg-5 col-xl-3 text-end my-auto">
                            <div className="d-flex justify-content-end align-items-center">
                                <div className="d-none d-sm-inline" title="รายการสินค้าในตะกร้า" onMouseOver={() => { setFloat(true) }} onMouseLeave={() => { setFloat(false) }}>
                                    <span style={{ cursor: "default" }} className="d-inline-block">ตะกร้าสินค้า <i className="fas fa-caret-right me-2"></i></span>
                                </div>
                                <div className="d-inline" title="รายการสินค้าทั้งหมด" onMouseOver={() => { setFloat(true) }} onMouseLeave={() => { setFloat(false) }}>
                                    <button className="btn btn-sm btn-outline-info" onClick={() => { pageChange('cart'); orderShow(); }} >
                                        <i className="fa fa-shopping-basket me-2"></i>
                                        <span>{cart.length}</span>
                                    </button>
                                </div>
                            </div>
                            {/* -- cart float -- */}
                            <div className={float ? "float" : "hidden"}>
                                <div className="arrow-order">
                                    <div className="arrow"></div>
                                </div>
                                <div className="card bg-light shadow">
                                    <div className="card-body p-2">
                                        <ul className="order-cart">
                                            <li className="text-secondary">สลากที่เพิ่งเพิ่มเข้าไป</li>
                                            <li><hr className="border-dark" /></li>
                                            {cart.length > 0 ?
                                                cart.map((e, i) => {
                                                    total += (e.item.sale * e.Qty);
                                                    QtyAll += 1;
                                                    return (
                                                        <li key={i} className="h5 d-flex">
                                                            <div className="col-5 ps-3 text-start">
                                                                <span style={{ letterSpacing: "3px" }} className="text-dark">{e.item.l_number}</span>
                                                            </div>
                                                            <div className="col-4 text-center">
                                                                <span className="text-secondary fw-light">{e.Qty}</span>
                                                            </div>
                                                            <div className="col-3 text-end pe-3">
                                                                <span className="text-danger">&#3647;{e.item.sale}</span>
                                                            </div>

                                                        </li>
                                                    )
                                                })
                                                : <li className="text-secondary text-center">ยังไม่มีสลากในตะกร้า</li>}
                                        </ul>
                                        <div className="mt-2">
                                            <span>รวม {QtyAll} รายการ : <span className="fw-bold text-danger">{total.toLocaleString('th-TH')} บาท</span></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* --- end cart float --- */}
                        </div>
                        {/* -- end cart -- */}
                    </div>
                </div>
            </div>
            {/* -- end แท็ปโลโก้ -- */}

            {/* -- banner -- */}
            <div className="m-0 p-1 row justify-content-center">
                <div style={{ height: "100px", width: "600px" }} className="bg-secondary p-0 m-1">
                    <img src={banner.position1} alt="banner" style={{ height: "100px", width: "600px" }}></img>
                </div>
                <div style={{ height: "100px", width: "600px" }} className="bg-secondary p-0 m-1">
                    <img src={banner.position2} alt="banner" style={{ height: "100px", width: "600px" }}></img>
                </div>
                <div style={{ height: "100px", width: "600px" }} className="bg-secondary p-0 m-1">
                    <img src={banner.position3} alt="banner" style={{ height: "100px", width: "600px" }}></img>
                </div>
                <div style={{ height: "100px", width: "600px", overflow: "hidden" }} className="bg-secondary p-0 m-1">
                    <img src={banner.position4} alt="banner" style={{ height: "100px", width: "600px" }}></img>
                </div>
            </div>

            {/* --- เปลี่ยนหน้าแสดงผล --- */}
            <div className="container-xl mx-auto">
                <div className={page === "cart" ? "shadow" : "hidden"}>
                    {<Ordercart data={cart} orderRemove={orderRemove} pageChange={pageChange} cartChange={cartChange} />}
                </div>
                <div className={page === "listlotto" || page === "reloadlistlotto" ? "shadow mb-5 rounded-bottom" : "hidden"}>
                    {<Listlotto orderSent={orderIn} reloadpage={reload} />}
                </div>
            </div>
        </div>
    )
}

export default Index;