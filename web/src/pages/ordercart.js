import axios from "axios";
import { useState } from "react";
import config from "../config";
import alertBox from "sweetalert2";
// import dayjs from "dayjs";

function Ordercart(props) {
    const { data } = props;
    const [customerName, setCustomername] = useState('');
    const [customerPhone, setCutomerphone] = useState('');
    const [customerAddress, setCustomeraddress] = useState('');
    const [payDate, setPaydate] = useState('');
    const [payTime, setPaytime] = useState('');
    let total = 0;
    let QtyAll = 0;

    const orderRemove = (index) => {
        props.orderRemove(index);
        console.log(index)
    }

    const changeQty = (index, value) => {
        const stock = data[index].item.stock
        let Qty
        const valueInt = parseInt(value)

        if (valueInt >= stock) {
            Qty = stock
        } else if (valueInt > 0) {
            Qty = valueInt
        } else if (valueInt <= 0) {
            Qty = 1
        } else {
            Qty = ""
        }

        props.cartChange(index, Qty)

    } // end changeQty

    const pageChange = (e) => {
        setTimeout(() => {
            props.pageChange(e);
            // window.location.reload();
        }, 500)
    }

    const clearInput = () => {
        setCustomername('')
        setCutomerphone('')
        setCustomeraddress('')
        setPaydate('')
        setPaytime('')
    } // end clearinput

    const handleBuy = async (e) => {
        e.preventDefault();

        try {
            const datetime = payDate + "T" + payTime;
            const payload = {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                payDate: new Date(datetime),
                // cart: lottoOrder,
                cart: data,
            }
            const res = await axios.post(config.apiPath + "/api/lotto/confirmbuy", payload)

            if (res.data.state === "success") {
                await alertBox.fire({
                    title: "คำสั่งซื้อเสร็จสมบูรณ์",
                    text: "",
                    icon: "success",
                    allowOutsideClick: false,
                    // confirmButtonColor: "#0d6efd",
                    // confirmButtonText: `<a href="test" target="_blank" class="btn text-light">OK, Order Detail</a>`,
                    timer: 2000
                }).then(() => {
                    clearInput();
                    document.getElementById("btn-close-modal").click();
                    pageChange("reloadlistlotto")
                    orderRemove("clear");
                    console.log(res)
                    console.log(res.data)
                })
            } else {
                alertBox.fire({
                    title: "สินค้าหมด หรือบางรายการมีไม่พอ",
                    icon: "warning"
                })
                console.log(res.data)
                return;
            }
        } catch (err) {
            alertBox.fire({
                title: "network error",
                icon: "warning"
            })
            console.log(err)
        }
    } // end inputhange

    // const showDebug = () => {
    //     console.log(data)
    // }

    return (
        <div className="h-100">
            <div className="bg-light rounded-bottom pb-4">
                <div className="container">
                    <div className="text-center py-4">
                        <i className="fa fa-shopping-basket me-2"></i>
                        <h4 className="d-inline">ตะกร้าสินค้า</h4>
                    </div>

                    {/* -- table -- */}
                    <div>
                        <table className="table text-center table-hover table-sm">
                            <thead className="table-secondary">
                                <tr>
                                    <th className="col-4">เลข</th>
                                    <th className="col-2">จำนวน</th>
                                    <th className="col-2">ราคา/หน่วย</th>
                                    <th className="col-2">ยอดรวม</th>
                                    <th className="col-2">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data !== undefined ? (
                                    data.map((e, i) => {
                                        total += (e.item.sale * e.Qty);
                                        QtyAll += 1;
                                        return (
                                            <tr key={i}>
                                                <td style={{ letterSpacing: "5px" }} className="h4 ">{e.item.l_number}</td>
                                                <td><input style={{ width: "70px" }} type="number" className="form-control text-center mx-auto" value={e.Qty} onChange={(e) => { changeQty(i, e.target.value) }}></input></td>
                                                <td>{e.item.sale}</td>
                                                <td>{e.item.sale * e.Qty}</td>
                                                <td>
                                                    <button className="btn btn-danger py-0 px-2" onClick={() => { orderRemove(i) }} >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })) : (
                                    <tr>
                                        <td>no data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end">
                            <p>รวม ({QtyAll} รายการ) : <span className="h4 fw-bold mx-2 text-danger">{total.toLocaleString('th-TH')} บาท</span></p>
                        </div>
                        <div className="text-end">
                            <button disabled={data.length > 0 ? "" : "disabled"} className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#modalConfirm">
                                <i className="fa fa-check me-2"></i>ยืนยันคำสั่งซื้อ
                            </button>
                        </div>
                    </div>
                    {/* --- end table --- */}
                </div>

                {/* --- modal --- */}
                <form onSubmit={handleBuy}>
                    <div className="modal fade modal-lg" id="modalConfirm" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <p className="h5">ยืนยันคำสั่งซื้อ</p>
                                    <div className="alert alert-primary d-flex flex-column align-items-center py-0">
                                        <p className="mt-0 pt-0">กรุณาทำการชำระเงินมายังบัญชี</p>
                                        <p>ธนาคาร กรุงไทย</p>
                                        <p>ชื่อบัญชี : <span className="fw-bold">XXX</span></p>
                                        <p>เลขบัญชี : <span className="h4 fw-bold">XXX-XXXX-XXX</span></p>
                                        <p>ยอดโอน : <span className="fw-bold">{total.toLocaleString('th-TH')}</span> บาท</p>
                                        <p className="align-self-end mb-0">*แนบหลักฐานการโอนมาที่ XXX</p>
                                    </div>
                                    <div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="input-group">
                                                    <label htmlFor="name" className="input-group-text"><i className="fa fa-user"></i></label>
                                                    <input id="name" className="form-control" onChange={(e) => { setCustomername(e.target.value) }} value={customerName} placeholder="ป้อนชื่อผู้ซื้อ" required></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input-group">
                                                    <label htmlFor="tel" className="input-group-text"><i className="fa fa-phone"></i></label>
                                                    <input id="tel" type="number" className="form-control" onChange={(e) => { setCutomerphone(e.target.value) }} value={customerPhone} placeholder="ป้อนหมายเลขโทรศัพท์ผู้ซื้อ" required></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                <div className="input-group">
                                                    <label htmlFor="paydate" className="input-group-text">วันที่ชำระ</label>
                                                    <input id="paydate" type="date" className="form-control" onChange={(e) => { setPaydate(e.target.value) }} value={payDate} required></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input-group">
                                                    <label htmlFor="paytime" className="input-group-text">เวลาชำระ</label>
                                                    <input id="paytime" type="time" className="form-control" onChange={(e) => { setPaytime(e.target.value) }} value={payTime} required></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 input-group">
                                            <label htmlFor="address" className="input-group-text"><i className="fa fa-home"></i></label>
                                            <textarea id="address" className="form-control" onChange={(e) => { setCustomeraddress(e.target.value) }} value={customerAddress} rows="2" placeholder="(หากต้องการฝากไว้กับทางร้าน ไม่ต้องกรอกส่วนนี้)"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer justify-content-center">
                                    <button id="btn-close-modal" type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="fa fa-times me-2"></i>ยกเลิก</button>
                                    <button type="submit" className="btn btn-success px-4" ><i className="fa fa-check me-2"></i>ส่ง, ยืนยันคำสั่งซื้อ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {/* --- end modal --- */}
            </div>
            {/* <button className="btn btn-primary" onClick={showDebug}>click debug</button> */}
        </div>
    )
}

export default Ordercart;