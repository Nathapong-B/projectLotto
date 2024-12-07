import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import "./home.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import alertBox from "sweetalert2";
import HomeManage from "./home-manage";
import Company from "./company";
import Lotto from "./lotto";
import Billsale from "./billsale";
import Awardwinning from "./awardwinning";
import Balancesheet from "./balancesheet";
import UserManage from "./user_manage";
import Banner from "./banner";

function Home(props) {
    // console.log(props)
    const [userName, setUsername] = useState();
    const nav = useNavigate();
    const [expandNarrow, setExpandNarrow] = useState(false);
    const [page, setPage] = useState('home');

    useEffect(() => {
        fetchData();
        // xpandNarrow();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + "/api/user/info", config.headers());
            setUsername(res.data.info.name);
            // console.log(res.data)
        } catch (e) {
            await alertBox.fire({
                title: "Token expire..!!",
                text: "Please login",
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
                // }).then((res) => {
                //     if (res.isConfirmed) {
                //         nav("/login")
                //     }
            })
            nav("/login")
            console.log("error.. please login")
        }
    };

    const handleLogout = () => {
        nav('/login')
        config.handleLogout();
    } // handleLogout

    return (
        <div className="contain">
            <div className={expandNarrow ? "sidebar sidebar-narrow" : "sidebar"}>
                <div className="text-end text-info pe-2">
                    <span className={expandNarrow ? "xpand-narrow xpand-narrow-flip" : "xpand-narrow"}>
                        <i style={{ cursor: "pointer" }} title="ย่อ/ขยาย แถบเมนู" className="fa fa-angles-left" onClick={() => setExpandNarrow(!expandNarrow)}></i>
                    </span>
                </div>
                <div className={expandNarrow ? "hidden" : "text-bar"}>
                    <div className={expandNarrow ? "hidden" : "text-center"}><Link to="/">Lotto Agent</Link></div>
                    <h3 className={expandNarrow ? "hidden" : ""}>Back office</h3>
                </div>
                <div className={expandNarrow ? "hidden" : "user text-user"}><span><i className="fa fa-user me-2"></i>{userName}</span></div>
                <div className="menu">
                    <Link to="#" onClick={() => setPage('home')}><span className={page === 'home' ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-home me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>หน้าหลัก</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('company')}><span className={page === "company" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-cog me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>ข้อมูลร้านค้า</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('lotto')}><span className={page === "lotto" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-money-bill-1-wave me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>สลาก</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('billsale')}><span className={page === "billsale" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-list-check me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>คำสั่งซื้อ</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('awardwinning')}><span className={page === "awardwinning" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-trophy me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>ถูกรางวัล</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('balancesheet')}><span className={page === "balancesheet" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-file-invoice-dollar me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>รายงานทางบัญชี</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('usermanage')}><span className={page === "usermanage" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-users me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>ผู้ใช้ระบบ</span>
                    </span></Link>
                    <Link to="#" onClick={() => setPage('banner')}><span className={page === "banner" ? "bg-hover text-light" : ""}>
                        <i style={{ width: "20px" }} className="fa fa-film me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>จัดการแบนเนอร์</span>
                    </span></Link>
                    <hr></hr>
                    <Link to="#" onClick={handleLogout}><span>
                        <i style={{ width: "20px" }} className="fa fa-right-from-bracket me-2 text-center"></i>
                        <span className={expandNarrow ? "hidden" : "d-inline p-0 m-0"}>ออกจากระบบ</span>
                    </span></Link>
                </div>
            </div>

            <div className="content">
                <div className={page === 'home' ? '' : 'hidden'}>
                    <div className="text-light h4">Home Lotto Project</div>
                    <div>{<HomeManage />}</div>
                </div>
                <div className={page === 'company' ? '' : 'hidden'}>
                    {<Company />}
                </div>
                <div className={page === 'lotto' ? '' : 'hidden'}>
                    {<Lotto />}
                </div>
                <div className={page === 'billsale' ? '' : 'hidden'}>
                    {<Billsale />}
                </div>
                <div className={page === 'awardwinning' ? '' : 'hidden'}>
                    {<Awardwinning />}
                </div>
                <div className={page === 'balancesheet' ? '' : 'hidden'}>
                    {<Balancesheet />}
                </div>
                <div className={page === 'usermanage' ? '' : 'hidden'}>
                    {<UserManage />}
                </div>
                <div className={page === 'banner' ? '' : 'hidden'}>
                    {<Banner />}
                </div>
            </div>

        </div>
    )
}

export default Home;