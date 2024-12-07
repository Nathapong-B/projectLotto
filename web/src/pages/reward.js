import axios from "axios";
import { useEffect, useState } from "react";
import config from "../config";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function Reward() {
    const [data, setData] = useState();
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [first, setFirst] = useState([]);
    const [second, setSecond] = useState([]);
    const [third, setThird] = useState([]);
    const [fourth, setFourth] = useState([]);
    const [fifth, setFifth] = useState([]);
    const [last2, setLast2] = useState([]);
    const [last3f, setLast3f] = useState([]);
    const [last3b, setLast3b] = useState([]);
    const [near1, setNear1] = useState([]);

    const dataSet = (data) => {
        return new Promise((resolve) => {
            const { first, second, third, fourth, fifth, last2, last3f, last3b, near1 } = data
            setFirst(first)
            setSecond(second)
            setThird(third)
            setFourth(fourth)
            setFifth(fifth)
            setLast2(last2)
            setLast3f(last3f)
            setLast3b(last3b)
            setNear1(near1)

            resolve(first)
            // resolve("dataset success")
        })
    } // end dataSet

    const dateSet = (dataDate) => {
        return new Promise((resolve) => {
            setDay(parseInt(dayjs(dataDate[0].date).format("DD")))
            // setDay(dayjs(dataDate[0].date).format("DD"))
            const monthInt = dayjs(dataDate[0].date).format("MM")
            setYear(dayjs(dataDate[0].date).format("YYYY"))

            switch (monthInt) {
                case '01': { setMonth("มกราคม"); break; }
                case '02': { setMonth("กุมภาพันธ์"); break; }
                case '03': { setMonth("มีนาคม"); break; }
                case '04': { setMonth("เมษายน"); break; }
                case '05': { setMonth("พฤษภาคม"); break; }
                case '06': { setMonth("มิถุนายน"); break; }
                case '07': { setMonth("กรกฎาคม"); break; }
                case '08': { setMonth("สิงหาคม"); break; }
                case '09': { setMonth("กันยายน"); break; }
                case '10': { setMonth("ตุลาคม"); break; }
                case '11': { setMonth("พฤศจิกายน"); break; }
                default: { setMonth("ธันวาคม"); break; }
            }

            // resolve(day)
            resolve("setDataDate success")
        })
    } // end setDataDate

    const fetchData = async () => {
        await axios.get(config.apiPath + '/api/reward/lastreward').then(async (res) => {
            if (res.data !== undefined) {
                const reward = await dataSet(res.data)
                const date = await dateSet(reward)
                setData(res.data)
                console.log(first)
                console.log(reward)
                console.log(date)
            }
        }).catch((e) => {
            console.log(e)
        })
    } // end fetchData

    useEffect(() => {
        fetchData()
    }, [])

    // const debug = () => {
    // }

    return (
        <div>
            {/* <button className="btn btn-primary" onClick={debug}>click debug</button> */}
            <div className="container-md">
                <p className="w-75 mx-auto h3 mt-4 fw-bold text-light">ผลการออกสลาก</p>
                <div className="w-75 bg-light mx-auto mb-5 rounded p-3 shadow">
                    <p className="fw-bold">ประจำวันที่ &nbsp;{day}&nbsp;{month}&nbsp;{parseInt(year) + 543}</p>

                    <div className="d-flex flex-row flex-wrap">
                        <div className="d-flex flex-row flex-wrap border-bottom w-100">
                            <div className="col-12 col-xl-3 p-2 border-bottom border-end">
                                <div className="fw-bold">รางวัลที่ 1</div>
                                <div>รางวัลละ {data !== undefined ? first[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div style={{ letterSpacing: "3px" }} className="h3 my-2 text-primary fw-bold">{data !== undefined ? first[0].number : ""}</div>
                            </div>
                            <div className="col-4 col-xl-3 p-2 border-end">
                                <div className="fw-bold">รางวัลเลขหน้า 3 ตัว</div>
                                <div>รางวัลละ {data !== undefined ? last3f[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap h3 my-2  text-primary fw-bold">
                                    {data !== undefined ?
                                        last3f.map((e) => {
                                            return (<span key={e.number} className="mx-2">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                            <div className="col-4 col-xl-3 p-2 border-end">
                                <div className="fw-bold">รางวัลเลขท้าย 3 ตัว</div>
                                <div>รางวัลละ {data !== undefined ? last3b[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap h3 my-2  text-primary fw-bold">
                                    {data !== undefined ?
                                        last3b.map((e) => {
                                            return (<span key={e.number} className="mx-2">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                            <div className="col-4 col-xl-3 p-2">
                                <div className="fw-bold">รางวัลเลขท้าย 2 ตัว</div>
                                <div>รางวัลละ {data !== undefined ? last2[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="h3 my-2  text-primary fw-bold">{data !== undefined ? last2[0].number : ""}</div>
                            </div>
                        </div>

                        <div className="d-flex flex-row flex-wrap border-bottom w-100">
                            <div className="col-12 col-xl-3 p-2 border-bottom border-end">
                                <div className="fw-bold">รางวัลข้างเคียงรางวัลที่ 1</div>
                                <div>รางวัลละ {data !== undefined ? near1[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap my-2  text-primary fw-bold">
                                    {data !== undefined ?
                                        near1.map((e) => {
                                            return (<span key={e.number} className="m-2">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-xl-9 p-2">
                                <div className="fw-bold">รางวัลที่ 2</div>
                                <div>รางวัลละ {data !== undefined ? second[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap my-2 text-primary fw-bold">
                                    {data !== undefined ?
                                        second.map((e) => {
                                            return (<span key={e.number} className="m-2">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-row border-bottom w-100">
                            <div className="p-2">
                                <div className="fw-bold">รางวัลที่ 3</div>
                                <div>รางวัลละ {data !== undefined ? third[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap my-2 text-primary fw-bold">
                                    {data !== undefined ?
                                        third.map((e) => {
                                            return (<span style={{ width: "4em" }} key={e.number} className="text-center m-1">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-row border-bottom w-100">
                            <div className="p-2">
                                <div className="fw-bold">รางวัลที่ 4</div>
                                <div>รางวัลละ {data !== undefined ? fourth[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap my-2 text-primary fw-bold">
                                    {data !== undefined ?
                                        fourth.map((e) => {
                                            return (<span style={{ width: "4em" }} key={e.number} className="text-center m-1">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="p-2">
                                <div className="fw-bold">รางวัลที่ 5</div>
                                <div>รางวัลละ {data !== undefined ? fifth[0].reward.toLocaleString('th-TH') : ""} บาท</div>
                                <div className="d-flex flex-wrap my-2 text-primary fw-bold">
                                    {data !== undefined ?
                                        fifth.map((e) => {
                                            return (<span key={e.number} style={{ width: "4em" }} className="m-1 text-center">{e.number}</span>)
                                        }) : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="w-75 mx-auto text-center pb-2">
                    <div>
                        <Link to="/"><span className="text-dark">HOME</span></Link>
                        <span className="mx-3 text-dark">|</span>
                        <Link to="/login"><span className="text-dark">LOGIN</span></Link>
                    </div>
                    <span className="fs-12px">copyright&#169;2567, &nbsp;&nbsp; Lotto Project</span>
                </div>
            </div>
        </div>
    )
}

export default Reward;