import axios from "axios";
import config from "../config";
import { useState } from "react";
import { Link } from "react-router-dom";

// ดึงค่ารางวัลจากเว็บกองสลาก
export default function HomeManage() {
    //debug
    const [dataRewardArr, setDatarewardarr] = useState([]);

    const updateRewardDetail = async () => {
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

    const checkalllotto = async () => {
        await axios.get(config.apiPath + '/api/reward/checkalllotto').then((res) => {
            console.log(res.data)
        }).catch((e) => {
            console.log(e)
        })
    } // end checkalllotto

    return (
        <div className="p-4">
            <button className="btn btn-primary mx-1" onClick={updateRewardDetail}>อัพเดทรางวัลล่าสุด ( ดึงข้อมูลรางวัลจากกองสลาก )</button>
            <button className="btn btn-primary mx-1" onClick={checkalllotto}>อัพเดทสลากที่ถูกรางวัล</button>
        </div>
    )
}
