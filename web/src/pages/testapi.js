import axios from "axios";
import config from "../config";
import { useState } from "react";
import { Link } from "react-router-dom";

// ทดสอบดึงค่ารางวัลจากเว็บกองสลาก
function Testapi() {
    //debug
    const [dataRewardArr, setDatarewardarr] = useState([]);

    const destructuring = (items) => {
        return new Promise((resolve) => {
            let { data, date } = items
            const { first, second, third, fourth, fifth, last2, last3f, last3b, near1 } = data;
            const dataArr = [first, second, third, fourth, fifth, last2, last3f, last3b, near1]
            resolve({ dataArr, date })
        })
    }//end destructuring

    const process = (dataAll) => {
        return new Promise((resolve) => {
            const data = dataAll.dataArr
            let dataReward = []
            for (let y = 0; y < data.length; y++) {
                for (let i = 0; i < data[y].number.length; i++) {
                    switch (y) {
                        case 5: {
                            dataReward.push({
                                level: 'last2',
                                number: data[y].number[i].value,
                                reward: parseInt(data[y].price),
                                date: dataAll.date
                            });
                            break;
                        }
                        case 6: {
                            dataReward.push({
                                level: 'last3f',
                                number: data[y].number[i].value,
                                reward: parseInt(data[y].price),
                                date: dataAll.date
                            });
                            break;
                        }
                        case 7: {
                            dataReward.push({
                                level: 'last3b',
                                number: data[y].number[i].value,
                                reward: parseInt(data[y].price),
                                date: dataAll.date
                            });
                            break;
                        }
                        case 8: {
                            dataReward.push({
                                level: 'near1',
                                number: data[y].number[i].value,
                                reward: parseInt(data[y].price),
                                date: dataAll.date
                            });
                            break;
                        }
                        default: {
                            dataReward.push({
                                level: (y + 1).toString(),
                                number: data[y].number[i].value,
                                reward: parseInt(data[y].price),
                                date: dataAll.date
                            });
                            break;
                        }
                    }
                }
            }
            resolve(dataReward);
        })
    }//end process

    const fetchData = async () => {
        try {
            const res = await axios.post(config.apiPath + '/api/reward/getdataglo')
            if (res.data.state === "success") {
                console.log(res.data.state)
                //     const des = await destructuring(res.data.result)
                //     const pro = await process(des)
                //     setDatarewardarr(pro)
                //     showData(pro);

            } else {
                console.log(res.data.state)
            }
        } catch (e) {
            console.log(e)
        }
    }

    // let x=0
    // let y=10
    const [x, setX] = useState(0);
    const [y, setY] = useState(10);
    const myPromise1 = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setX(x + 20)
                console.log(x)
                resolve("myPromise 1 : " + x)
            }, 3000)
        })
    }
    const myPromise2 = () => {
        return new Promise((resolve) => {
            setY(y + x)
            console.log(y)
            resolve("myPromise 2 : " + y)
        })
    }
    const showData = async () => {
        const data = await axios.get(config.apiPath + '/api/reward/testapi')
        console.log(data.data)
        // const one = await myPromise1()
        // const two = await myPromise2()
        // console.log(one)
        // console.log(two)
    }

    const addReward = async () => {
        const payload = { reward: dataRewardArr };
        await axios.post(config.apiPath + '/api/reward/addrewarddata', payload).then((res) => {
            if (res.data !== undefined) {
                console.log(res.data)
            }
        }).catch((e) => {
            console.log(e)
        })
        console.log(payload)
    }

    const checkalllotto = async () => {
        await axios.get(config.apiPath + '/api/reward/checkalllotto').then((res) => {
            console.log(res.data)
        }).catch((e) => {
            console.log(e)
        })
    } // end checkalllotto

    // ติด cors เวฺ็ปแบน localhost
    const getApiLotto = async () => {
        const res = await axios.post('https://www.glo.or.th/api/lottery/getLatestLottery');
        console.log(res.data)
    }

    // call api ไปที่ example-jwt-refresh-token
    const callApi = async () => {
        const payload = { name: "Tom" }
        const option = {
            params: {
                page: 10,
                limit: 20
            }
        };

        const res = await axios.post(config.apiPath + '/post', payload);
        console.log(res.data)
    } // end callApi

    return (
        <div className="p-4">
            <button className="btn btn-primary mx-1" onClick={fetchData}>ดึงข้อมูลรางวัลจากกองสลาก</button>
            <button className="btn btn-primary mx-1" onClick={destructuring}>destructuring</button>
            <button className="btn btn-primary mx-1" onClick={showData}>showdata</button>
            <button className="btn btn-primary mx-1" onClick={checkalllotto}>ตรวจรางวัล</button>
            <Link to="/" target="_blank"><button className="btn btn-primary mx-1">index</button></Link>
            <button className="btn btn-primary mx-1" onClick={getApiLotto}>ทดสอบเรียกดูรางวัลงวดล่าสุดจากกองสลาก</button>
            <button className="btn btn-primary mx-1" onClick={callApi}>ทดสอบเรียก Api nodejs+express</button>
        </div>
    )
}

export default Testapi;