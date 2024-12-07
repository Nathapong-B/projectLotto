import { useEffect } from "react"; //ใช้งานแบบเดียวกับ onload
import alertBox from "sweetalert2";

function Myuseeffect() {
    useEffect(() => {
        console.log("UseEffect");
    },[])
    //const show = document.getElementById("display"); //ประกาศตัวแปรข้างนอกเกิด error
    const disPlayAlet = () => {
        const show = document.getElementById("display");
        alertBox.fire({
            title: "สำเร็จ",
            text: "สร้างกล่องแจ้งเตือนสำเร็จแล้ว..",
            icon: "success",
            showCancelButton:true,
            confirmButtonText: "Ok..",
        }).then((res) => {
                console.log(res);
                show.innerHTML = "You Click OK..";
        })
        // alertBox.fire({
        //     title: "สำเร็จ",
        //     text: "สร้างกล่องแจ้งเตือนสำเร็จแล้ว..",
        //     icon: "success",
        //     showCancelButton: true,
        //     confirmButtonText: "Ok..",
        //     cancelButtonText: "ยังไม่พอใจ"
        // }).then(res => {
        //     if (res.isConfirmed) {
        //         console.log("click OK");
        //         show.innerHTML = "You Click OK..";
        //     } else {
        //         console.log("click Cancel");
        //         document.getElementById("display").innerHTML = "You Click Cancel..";
        //     }
        // })
    }
    return (
        <div>
            <h1>My UseEffect</h1>
            <button onClick={disPlayAlet}>Display Alert Box</button>
            <p id="display"></p>
        </div>
    )
}

export default Myuseeffect;