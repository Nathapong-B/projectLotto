import axios from "axios";
// import Home from "./home";
import config from "../config";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function Awardwinning() {
    const [data, setData] = useState([]);
    const [billInfo, setBillinfo] = useState([]);
    let total = 0;

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/reward/billwinning')
            if (res !== undefined) {
                setData(res.data)
            }
        } catch (err) {
            console.log(err)
        }
    } // end fetchData

    // const debug=()=>{
    //     console.log(total)
    // }

    return (
        <div>
            {/* <Home state={"awardwinning"}> */}
                {/* <button onClick={debug} className="btn btn-primary">debug</button> */}
                <div className="h4 text-light">Awards Winning <span className="h6">รายการที่ถูกรางวัล **ปุ่มดำเนินการใน modal ยังไม่เสร็จ</span></div>
                <div>
                    <table className="table text-center table-hover table-sm">
                        <thead className="table-secondary">
                            <tr>
                                <th className="col-2">บิลไอดี</th>
                                <th className="col-2">ลูกค้า</th>
                                <th className="col-2">เบอร์</th>
                                <th className="col-2">จำนวน (รางวัล)</th>
                                <th className="col-2">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ?
                                data.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e.id}</td>
                                            <td>{e.customerName}</td>
                                            <td>{e.customerPhone}</td>
                                            <td>{e.lottoAwards.length}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={() => { setBillinfo(e) }} data-bs-toggle="modal" data-bs-target="#modal-awd-billsaledetail" title="รายละเอียด">
                                                    <i className="fa fa-file me-2"></i> รายละเอียด
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                <tr>
                                    <td>no data</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {/* --- modal info --- */}
                <div className="modal fade" id="modal-awd-billsaledetail" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">รายละเอียด</h5>
                                <button id="btn-close-modalInfo" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div id="modalbody" className="modal-body">
                                <div className="text-start mb-3">
                                    <div><span className="fw-bold">Bill_ID :</span> {billInfo.id} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> {dayjs(billInfo.createdDate).format("DD/MM/YYYY HH:MM")} </div>
                                    <div><span className="fw-bold">ลูกค้า :</span> {billInfo.customerName} <span>&nbsp;&nbsp;</span> {billInfo.customerPhone}</div>
                                    <div><span className="fw-bold">ที่อยู่ :</span> {billInfo.customerAddress !== "" ? billInfo.customerAddress : "-"}</div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>เลข</th>
                                            <th>รางวัล</th>
                                            <th>จำนวน (ใบ)</th>
                                            <th>เงินรางวัล</th>
                                            <th>มูลค่ารวม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billInfo.BillSaleDetail !== undefined ?
                                            billInfo.BillSaleDetail.map((e, i) => {
                                                let rewardLevel
                                                let reward
                                                let sum
                                                if (e.lottoAwards.length === 0) {
                                                    rewardLevel = 0
                                                    reward = 0
                                                    sum = 0
                                                } else {
                                                    rewardLevel = e.lottoAwards[0].reward.level
                                                    reward = e.lottoAwards[0].reward.reward
                                                    sum = e.Qty * e.lottoAwards[0].reward.reward
                                                }
                                                total += sum
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{e.lotto.l_number}</td>
                                                        <td>{rewardLevel}</td>
                                                        <td>{e.Qty}</td>
                                                        <td>{reward.toLocaleString('th-TH')}</td>
                                                        <td>{sum.toLocaleString('th-TH')}</td>
                                                    </tr>
                                                )
                                            }) : <tr>
                                                <td>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                                <div>
                                    <p>ยอดรวมเงินรางวัล : <span className="h4 fw-bold mx-2 text-danger">{total.toLocaleString('th-TH')} บาท</span></p>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                {/* <button className="btn btn-danger" title="ยกเลิกคำสั่งซื้อ">
                                    <i className="fa fa-times me-2"></i>ยกเลิกคำสั่งซื้อ
                                </button> */}
                                <button className="btn btn-success mx-2" title="ดำเนินการเรียบร้อยแล้ว">
                                    <i className="fa fa-check me-2"></i>ดำเนินการเรียบร้อยแล้ว
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- end modal info --- */}
            {/* </Home> */}
        </div>
    )
}

export default Awardwinning;