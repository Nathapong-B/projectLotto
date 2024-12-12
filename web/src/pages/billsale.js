import { useEffect, useState } from "react";
// import Home from "./home";
import axios from "axios";
import config from "../config";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function Billsale() {
    const [dataBill, setDatabill] = useState();
    const [billdetail, setBilldetail] = useState({});
    let total = 0;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + "/api/lotto/billsale").then(res => {
                if (res.data.length > 0) {
                    setDatabill(res.data)
                }
                // console.log(dataBill)
            }).catch(err => {
                console.log(err)
            })
        } catch (err) {
            console.log(err)
        }
    } // end fetchData

    const handleRomovebill = async (billsale) => {
        try {
            Swal.fire({
                title: "ยืนยันการลบคำสั่งซื้อ",
                icon: "warning",
                showCancelButton: true,
            }).then(async (click) => {
                if (click.isConfirmed) {
                    await axios.delete(config.apiPath + "/api/lotto/removebill/" + billsale.id).then((res) => {
                        if (res.data.state === "success") {
                            Swal.fire({
                                title: "ลบข้อมูลเรียบร้อย",
                                icon: "success",
                                timer: 2000
                            })
                            // console.log(res.data)
                            // console.log(res)
                            // console.log(res.data)
                            fetchData();
                        } else {
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด",
                                icon: "error"
                            })
                            console.log(res)
                        }
                    })
                }
            })
            console.log(billsale)
        } catch (e) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                icon: "error"
            })
            console.log(e)
        }
    } // end handleRomovebill

    const handleConfirmBill = async (bill) => {
        try {
            const payload = { confirmState: "true" }
            await axios.put(config.apiPath + "/api/lotto/confirmbill/" + bill.id, payload).then((res) => {
                if (res.data.state === "success") {
                    fetchData();
                    document.getElementById('btn-close-modal').click();
                    document.getElementById('btn-close-modalInfo').click();
                    // console.log(res)
                }
            }).catch((e) => {
                console.log(e)
            })
        } catch (err) {
            console.log(err)
        }
    } // end handleConfirmBill

    // const showDebug = () => {
    //     console.log(billdetail)
    // }

    return (
        <div>
            {/* <Home state={"billsale"}> */}
                {/* <button className="btn" onClick={showDebug}>Click</button> */}
                <div>
                    <h4 className="text-light">รายการคำสั่งซื้อ</h4>
                </div>
                <div>
                    <table className="table table-hover table-sm text-center">
                        <thead className="table-secondary">
                            <tr>
                                <th className="col-2">วันที่ทำรายการ</th>
                                <th className="col-2">ลูกค้า</th>
                                <th className="col-1">โทรศัพท์</th>
                                <th className="col-3">ที่อยู่</th>
                                <th className="col-2">วันที่ชำระ</th>
                                <th className="col-2">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataBill !== undefined ?
                                dataBill.map((e, i) => {
                                    return (
                                        <tr key={i} className={e.confirmState === "false" ? "fw-bold" : "fw-light"}>
                                            <td>{dayjs(e.createdDate).format("DD-MM-YYYY HH:mm")}</td>
                                            <td>{e.customerName}</td>
                                            <td>{e.customerPhone}</td>
                                            <td>{e.customerAddress}</td>
                                            <td>{dayjs(e.payDate).format("DD-MM-YYYY HH:mm")}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={() => { setBilldetail(e) }} data-bs-toggle="modal" data-bs-target="#modal-bs-billsaledetail" title="รายละเอียด">
                                                    <i className="fa fa-file"></i>
                                                </button>
                                                <button className="btn btn-danger btn-sm mx-2" title="ยกเลิกคำสั่งซื้อ" onClick={() => { handleRomovebill(e) }}>
                                                    <i className="fa fa-times"></i>
                                                </button>
                                                <button className="btn btn-success btn-sm" onClick={() => { setBilldetail(e) }} data-bs-toggle="modal" data-bs-target="#modal-confirmpay" title="ยืนยันคำสั่งซื้อ" disabled={e.confirmState === "false" ? "" : "disabled"}>
                                                    <i className="fa fa-check"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr><td>"Network error or Empty data"</td></tr>}
                        </tbody>
                    </table>
                </div>
                {/* --- modal info --- */}
                <div className="modal fade" id="modal-bs-billsaledetail" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">รายการสั่งซื้อ</h5>
                                <button id="btn-close-modalInfo" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div id="modalbody" className="modal-body">
                                <div className="text-start mb-3">
                                    <div><span className="fw-bold">Bill_ID :</span> {billdetail.id} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> {dayjs(billdetail.createdDate).format("DD/MM/YYYY HH:MM")} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <span className="fw-bold h4 text-success">{billdetail.confirmState === "true" ? "ยืนยันแล้ว" : ""}</span></div>
                                    <div><span className="fw-bold">ลูกค้า :</span> {billdetail.customerName} <span>&nbsp;&nbsp;</span> {billdetail.customerPhone}</div>
                                    <div><span className="fw-bold">ที่อยู่ :</span> {billdetail.customerAddress !== "" ? billdetail.customerAddress : "-"}</div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>เลข</th>
                                            <th>ราคา</th>
                                            <th>จำนวน (ใบ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billdetail.BillSaleDetail !== undefined ?
                                            billdetail.BillSaleDetail.map((e, i) => {
                                                total += e.sale * e.Qty;
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{e.lotto.l_number}</td>
                                                        <td>{e.sale}</td>
                                                        <td>{e.Qty}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td>"no data"</td></tr>}
                                    </tbody>
                                </table>
                                <div>
                                    <p>ยอดรวม : <span className="h4 fw-bold mx-2 text-danger">{total.toLocaleString('th-TH')} บาท</span></p>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <button className="btn btn-danger" onClick={() => { handleRomovebill(billdetail) }} data-bs-dismiss="modal" title="ยกเลิกคำสั่งซื้อ">
                                    <i className="fa fa-times me-2"></i>ยกเลิกคำสั่งซื้อ
                                </button>
                                <button className="btn btn-success mx-2" title="ยืนยันคำสั่งซื้อ" onClick={() => { handleConfirmBill(billdetail) }} disabled={billdetail.confirmState === "false" ? "" : "disabled"}>
                                    <i className="fa fa-check me-2"></i>ยืนยันคำสั่งซื้อ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- end modal info --- */}

                {/* --- modal confirm --- */}
                <div className="modal fade" id="modal-confirmpay" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">ยืนยันรายการสั่งซื้อ</h5>
                                <button id="btn-close-modal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div id="modalbody" className="modal-body">
                                <div className="text-start mb-3">
                                    <div><span className="fw-bold">Bill_ID :</span> {billdetail.id} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> {dayjs(billdetail.createdDate).format("DD/MM/YYYY HH:MM")}</div>
                                    <div><span className="fw-bold">ลูกค้า :</span> {billdetail.customerName} <span>&nbsp;&nbsp;</span> {billdetail.customerPhone}</div>
                                    <div><span className="fw-bold">ที่อยู่ :</span> {billdetail.customerAddress !== "" ? billdetail.customerAddress : "-"}</div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>เลข</th>
                                            <th>ราคา</th>
                                            <th>จำนวน (ใบ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billdetail.BillSaleDetail !== undefined ?
                                            billdetail.BillSaleDetail.map((e, i) => {
                                                total += e.sale * e.Qty;
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{e.lotto.l_number}</td>
                                                        <td>{e.sale}</td>
                                                        <td>{e.Qty}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td>"no data"</td></tr>}
                                    </tbody>
                                </table>
                                <div>
                                    <p>ยอดรวม : <span className="h4 fw-bold mx-2 text-danger">{total.toLocaleString('th-TH')} บาท</span></p>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <button id="btn-close-modal" className="btn btn-danger" data-bs-dismiss="modal" title="ปิดหน้าต่าง">
                                    <i className="fa fa-times me-2"></i>ปิด
                                </button>
                                <button className="btn btn-success mx-2" title="ยืนยันคำสั่งซื้อ" onClick={() => { handleConfirmBill(billdetail) }}>
                                    <i className="fa fa-check me-2"></i>ยืนยันคำสั่งซื้อ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- end modal confirm --- */}
            {/* </Home> */}
        </div>
    )
}

export default Billsale;