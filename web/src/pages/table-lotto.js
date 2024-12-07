import axios from "axios";
import config from "../config";
import alertBox from "sweetalert2";
import dayjs from "dayjs";

function Tablelotto(props) {
    const { data } = props; //ประกาศ data รับค่าจาก lotto

    const editData = (item) => {
        props.transItem(item); //ส่งค่าไปหน้า lotto.js เพื่อทำการ edit
    };

    const trxData = () => {
        props.reqData("Req");
    }; // ร้องขอการรีค่าข้อมูลตาราง

    const deleteItem = async (item) => {
        //console.log("item for delete : "+item);
        try {
            alertBox.fire({
                title: "Are you sure to delete item",
                text: "เลขฉลาก : " + item.l_number + ", เล่มที่ : " + item.bookNumber + ", งวดวันที่ : " + dayjs(item.roundDate).format("DD-MM-YYYY"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก"
            }).then((res) => {
                if (res.isConfirmed) {
                    axios.delete(config.apiPath + "/api/lotto/del/" + item.id).then((res) => {
                        if (res.data.id !== undefined) {
                            alertBox.fire({
                                title: "Commplete",
                                text: "Remove item complete",
                                icon: "success",
                            })
                            trxData();
                            console.log("remove : " + res.data.id);
                        }
                    }).catch((err) => {
                        alertBox.fire({
                            title: "Invalid..!!",
                            text: err.message,
                            icon: "error",
                        })
                        console.log(err);
                    })
                }
            }) // end alertBox-confirm
        } catch (err) {
            alertBox.fire({
                title: "Invalid..!!",
                text: err.message,
                icon: "error",
            })
            console.log(err);
        }
    } // end deleteItem

    // const debug =()=>{
    //     console.log(typeof(data[0].roundDate))
    //     console.log(dayjs(data[0].roundDate).format('DD-MM-YYYY'))
    // }

    return (
        <div className="mt-4">
            {/* <button onClick={debug} className="btn btn-outline-info m-2">debug</button> */}
            <table className="table table-sm table-hover text-center">
                <thead className="table-secondary">
                    <tr>
                        <th className="col-1">เล่มที่</th>
                        <th className="col-3">งวดวันที่</th>
                        <th className="col-3">เลข</th>
                        <th className="col-1">ต้นทุน</th>
                        <th className="col-1">ราคาขาย</th>
                        <th className="col-1">คงเหลือ</th>
                        <th className="col-2">#</th>
                    </tr>
                </thead>
                <tbody>
                    {data !== undefined ? (
                        data.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e.bookNumber}</td>
                                    <td>{dayjs(e.roundDate).format("DD-MM-YYYY")}</td>
                                    <td style={{ letterSpacing: "5px" }} className="fw-bold h5">{e.l_number}</td>
                                    <td>{e.cost}</td>
                                    <td>{e.sale}</td>
                                    <td>{e.stock}</td>
                                    <td>
                                        <button onClick={() => { editData(e) }} className="btn btn-sm btn-primary me-2">
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                        <button onClick={() => { deleteItem(e) }} className="btn btn-sm btn-danger">
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
        </div>
    )
}

export default Tablelotto;