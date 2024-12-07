import { useEffect, useState } from "react";
// import Home from "./home";
import axios from "axios";
import config from "../config";
import dayjs from "dayjs";

function Balancesheet() {
    const [dataBill, setDataBill] = useState([]);
    const [dataLotto, setDataLotto] = useState([]);
    const [dataStockWin, setDataStockWin] = useState([]);
    const [billInfo, setBillinfo] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [totalStock, setTotalStock] = useState(0);
    // const[profit,setRev]=useState(0);
    let roundDate;
    let startDate = new Date();
    let endDate = new Date();
    let modalSum = 0;
    const [opt, setOpt] = useState(true);

    useEffect(() => {
        // fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                roundDate: roundDate,
                startDate: startDate,
                endDate: endDate
            }

            const res = await axios.post(config.apiPath + '/api/balancesheet/balancesheet', payload)
            if (res.data.billsale !== undefined) {
                setDataBill(res.data.billsale)
                setDataLotto(res.data.lotto)
                setDataStockWin(res.data.stockWin)
                computeTotal(res.data)
            }
            // console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    } // end fetchData

    const setRoundDate = (round) => {
        switch (round) {
            case '2024-03-01': {
                roundDate = round
                startDate = '2024-02-17'
                endDate = '2024-03-01'
                break;
            }
            case '2024-02-16': {
                roundDate = round
                startDate = '2024-02-02'
                endDate = '2024-02-17'
                break;
            }
            default: {
                roundDate = null
                startDate = new Date()
                endDate = new Date()
                break;
            }
        }
    } // end roundDate

    const computeTotal = (data) => {
        let sum = 0;
        let cost = 0;
        let stock = 0;

        if (data.billsale.length > 0) {
            // คำนวณยอดรวมรายได้
            for (let i = 0; i < data.billsale.length; i++) {
                const Billdetail = data.billsale[i].BillSaleDetail
                for (let j = 0; j < Billdetail.length; j++) {
                    sum += Billdetail[j].sale * Billdetail[j].Qty
                }
            }
            // setTotal(10)
            setTotal(sum)

            // คำนวณต้นทุน
            for (let i = 0; i < data.lotto.length; i++) {
                cost += data.lotto[i].cost * data.lotto[i].all_stock
            }
            // setTotalCost(50)
            setTotalCost(cost)

            // คำนวณรายได้จากสลากคงเหลือ
            for (let i = 0; i < data.stockWin.length; i++) {
                const stockWin = data.stockWin[i]
                stock += stockWin.lotto.stock * stockWin.reward.reward
            }
            // setTotalStock(10)
            setTotalStock(stock)
        } else {
            setTotal(0)
            setTotalCost(0)
            setTotalStock(0)
        }

    } // end computeTotal

    const computeSale = (item) => {
        let sum = 0;
        for (let i = 0; i < item.length; i++) {
            sum += item[i].sale * item[i].Qty
        }
        return sum;
    } // end computeSale

    // const debug = () => {
    //     console.log(dataBill[0].payDate)
    // }

    // let profit = -10
    let profit = (total + totalStock - totalCost)
    return (
        <div>
            {/* <Home state={"balancesheet"} > */}
                {/* <button className="btn btn-info" onClick={debug}>debug</button> */}
                <div className="h4 text-light">รายงานทางบัญชี</div>
                <div className="container p-0">
                    <div className="my-2 row alert alert-secondary">
                        <div className="col-6 col-xl-4 m-auto">
                            <div className="input-group">
                                <select id="tagRounddate" className="form-select border border-2 border-primary" onChange={(e => { setRoundDate(e.target.value) })} onClick={() => { setOpt(false) }}>
                                    <option value="null" disabled={opt ? "" : "disabled"}>เลือกงวดวันที่</option>
                                    <option value="2024-03-01">1 มีนาคม 2567</option>
                                    <option value="2024-02-16">16 กุมภาพันธ์ 2567</option>
                                </select>
                                <button style={{ width: "100px" }} className="btn btn-primary" onClick={fetchData}>
                                    <i className="fa fa-search me-2"></i>ค้นหา
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ////////////////////////////////////////////// */}

                    <div className="row">

                        {/* table lotto */}
                        <div className="col-3">
                            <div className="border-end border-4 border-danger text-end m-0 mb-2 p-0">
                                <div className="text-dark mx-2 my-2">
                                    <span className="text-light">ต้นทุนสลาก</span>
                                    <span className="d-block fw-bold h5 text-danger">{totalCost.toLocaleString('th-TH')} บาท</span>
                                </div>
                            </div>
                            <table className="table text-center table-hover table-sm table-bordered fs-12px">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>เลข</th>
                                        <th>จำนวน</th>
                                        <th>หน่วย</th>
                                        <th>รวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataLotto.length > 0 ?
                                        dataLotto.map((e, i) => {
                                            let sum = e.cost * e.all_stock
                                            return (
                                                <tr key={i}>
                                                    <td>{e.l_number}</td>
                                                    <td>{e.all_stock}</td>
                                                    <td className="text-end">{e.cost}</td>
                                                    <td className="text-end">{sum}</td>
                                                </tr>
                                            )
                                        }) : <tr><td>data not found</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* end table lotto */}

                        {/* table billsale */}
                        <div className="col-3">
                            <div className="border-end border-4 border-success text-end m-0 mb-2 p-0">
                                <div className="text-dark mx-2 my-2">
                                    <span className="text-light">รายได้จากการขาย</span>
                                    <span className="d-block fw-bold h5 text-success">{total.toLocaleString('th-TH')} บาท</span></div>
                            </div>
                            <table className="table text-center table-hover table-sm table-bordered fs-12px">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>บิลไอดี</th>
                                        <th>วันที่</th>
                                        <th>ยอดรวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataBill.length > 0 ?
                                        dataBill.map((e, i) => {
                                            let sum = computeSale(e.BillSaleDetail)
                                            return (
                                                <tr key={i} onClick={() => { setBillinfo(e) }} data-bs-toggle="modal" data-bs-target="#modal-bln-billsaledetail" title="ดูข้อมูลเพิ่มเติม" className="tr-cursor">
                                                    <td>{e.id}</td>
                                                    <td>{dayjs(e.payDate).format('DD-MM-YYYY')}</td>
                                                    <td className="text-end">{sum}</td>
                                                </tr>
                                            )
                                        }) : <tr><td>data not found</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* end table billsale */}

                        {/* table stock */}
                        <div className="col-3">
                            <div className="border-end border-4 border-success text-end m-0 mb-2 p-0">
                                <div className="text-dark mx-2 my-2">
                                    <span className="text-light">รายได้จากสลากคงเหลือ</span>
                                    <span className="d-block fw-bold h5 text-success">{totalStock.toLocaleString('th-TH')} บาท</span></div>
                            </div>
                            <table className="table text-center table-hover table-sm table-bordered fs-12px">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>เลข</th>
                                        <th>คงเหลือ</th>
                                        <th>รางวัล</th>
                                        <th>รวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataStockWin.length > 0 ?
                                        dataStockWin.map((e, i) => {
                                            let sum = e.reward.reward * e.lotto.stock;
                                            return (
                                                <tr key={i}>
                                                    <td>{e.lotto.l_number}</td>
                                                    <td>{e.lotto.stock}</td>
                                                    <td className="text-end">{e.reward.reward.toLocaleString('th-TH')}</td>
                                                    <td className="text-end">{sum.toLocaleString('th-TH')}</td>
                                                </tr>
                                            )
                                        }) : <tr><td>data not found</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* end table stock */}

                        {/* profit report */}
                        <div className="col-3">
                            <div className="border-end border-4 border-success text-end m-0 mb-2 p-0">
                                <div className="text-warning mx-2 my-2">
                                    <span className="text-light">ผลกำไร</span>
                                    <span className="d-block fw-bold h3">{profit.toLocaleString('th-TH')} บาท</span>
                                </div>
                            </div>
                        </div>
                        {/* end profit */}
                    </div>
                </div>

                {/* --- modal info --- */}
                <div className="modal fade" id="modal-bln-billsaledetail" tabIndex="-1">
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
                                            <th>ราคา</th>
                                            <th>จำนวน (ใบ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billInfo.BillSaleDetail !== undefined ?
                                            billInfo.BillSaleDetail.map((e, i) => {
                                                modalSum += e.sale * e.Qty;
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{e.lotto.l_number}</td>
                                                        <td>{e.sale}</td>
                                                        <td>{e.Qty}</td>
                                                    </tr>
                                                )
                                            }) : <tr>
                                                <td>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                                <div>
                                    <p>ยอดรวม : <span className="h4 fw-bold mx-2 text-danger">{modalSum.toLocaleString('th-TH')} บาท</span></p>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <button className="btn btn-success mx-2" title="ปิดหน้าต่าง" data-bs-dismiss="modal">
                                    <i className="fa fa-times me-2"></i> close
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

export default Balancesheet;