import axios from "axios";
import config from "../config";
import { useEffect, useState } from "react";
import "./pagelimit.css";

// ทดสอบเลื่อน scroll ลงสุดจอแล้วดึงข้อมูลเพิ่ม
function Testpagelimit() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [load, setLoad] = useState(true);
    const limitcount = 8;

    useEffect(() => {
        // fetchData();
        // setParamdata();
        isLoad(false)
    }, [])

    const setParamdata = () => {
        setPage(page + limitcount);
        console.log("page : "+page)
    }

    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const demo = document.getElementById('demo')
        const new_div = document.createElement("div");
        demo.innerHTML = `<p>scrollTop : ${scrollTop}</p>
        <p>scrollHeight : ${scrollHeight}</p>
        <p>clientHeight : ${clientHeight}</p>`

        // ถ้าระยะการเลื่อนของ scroll+ความสูงของหน้าจอแสดงผล >= ความสูงของหน้าจอทั้งหมด
        if (scrollTop + clientHeight >= scrollHeight) {
            document.getElementById('btnCreatecard').click();
            // isLoad(false);
            // demo.append(new_div)
        }
    })

    const fetchData = async () => {
        const option = {
            params: {
                page: page,
                limit: limitcount
            }
        };
        console.log("fetchData page : " + option.params.page)

        try {
            await axios.get(config.apiPath + "/api/lotto/testget", option).then((res) => {
                if (res !== undefined) {
                    data.length !== 0 ? setData([...data, ...res.data.res]) : setData(res.data.res);
                    setLoad(true)
                    console.log(data)
                }
            }).catch((err) => {
                console.log("axios catch error")
            })
        } catch (e) {
            console.log("try catch error")
        }
    } // end fetchData

    const isLoad = (s) => {
        if (s === load) {
            console.log("load in if : " + s)
            return;
        }
        if (!s && page < 25) {
            setLoad(false)
            setTimeout(() => {
                setParamdata();
                fetchData()
            }, 3000);
        }
    }

    const addtoCart = (e) => {
        console.log(e)
    }

    const showDebug = async () => {
        console.log(load)
    }

    return (
        <div>
            <div id="demo" style={{ position: "fixed", zIndex: "1" }} className="text-bg-dark"></div>
            <div className="bg-light container text-center py-5">
                <button className="btn btn-primary" onClick={showDebug}>click debug</button>
                <div id="lotto" className="row">
                    {data !== undefined ?
                        data.map((e, i) => {
                            return (
                                <div className="col-6" key={i}>
                                    <div className="card border-primary text-bg-light my-2">
                                        <div className="card-body">
                                            <div style={{ letterSpacing: "5px" }} className="h2 text-primary fw-bold">{e.id}</div>
                                            <div style={{ letterSpacing: "5px" }} className="h2 text-primary fw-bold">{e.l_number}</div>
                                            <div className="h4 text-">{e.sale} บาท</div>
                                            <div className="mt-2">
                                                <button className="btn btn-outline-success btn-sm" onClick={() => { addtoCart(e) }}>
                                                    <i className="fa fa-shopping-basket me-2"></i>เพิ่มลงตะกร้า</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : "Network error"}
                    <div id="loader" className="mt-4">
                        <div className={!load ? "show" : "notshow"}>
                            <div className="loader mx-auto"></div>
                        </div>
                    </div>
                    <button id="btnCreatecard" style={{ display: "none" }} onClick={() => { isLoad(false); showDebug() }}>click creatDiv</button>
                </div>
            </div>
        </div>
    )
}

export default Testpagelimit;