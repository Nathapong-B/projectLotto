import { useEffect, useState } from "react";
// import Home from "./home";
import axios from "axios";
import config from "../config";
import alertBox from "sweetalert2";
// import { useSearchParams } from "react-router-dom";

function Company() {
    const [cname, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [id, setId] = useState(0);
    const empty = "Please input data";

    // const [searchParams] = useSearchParams();
    // const paramsExpandNarrow = searchParams.get('narrow')

    useEffect(() => {
        fetchData();
        //console.log(typeof(id)+" id : "+id);
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + "/api/company/info");

            if (res.data.id !== undefined) {
                setId(res.data.id);
                setName(res.data.c_name);
                setPhone(res.data.phone);
                setAddress(res.data.address);
            }
            // console.log(res);
        } catch (e) {
            // alertBox.fire({
            //     title: "Error..!!",
            //     text: e,
            //     icon: "error",
            // })
            console.log(e);
        }
    }; // end feetchData

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const payload = { c_name: cname, phone: phone, address: address };

            let res;

            // ตรวจสอบ id หากมีข้อมูลในตารางให้ทำการ edit หากไม่มีข้อมูล ให้ทำการ create
            if (id !== 0) {
                res = await axios.put(config.apiPath + "/api/company/edit/" + id, payload);

                if (res.data.id !== undefined) {
                    alertBox.fire({
                        title: "Success",
                        text: "Save data complete",
                        icon: "success",
                        timer: 2500
                    })
                    console.log("edit data completed")
                } else {
                    alertBox.fire({
                        title: "Error",
                        text: "Save data uncomplete",
                        icon: "error",
                    })
                    console.log("edit data uncompleted : " + res.data.message);
                }
            } else {
                res = await axios.post(config.apiPath + "/api/company/create", payload);

                if (res.data.id !== undefined) {
                    alertBox.fire({
                        title: "Success",
                        text: "Create data Complete",
                        icon: "success",
                        timer: 2000
                    })
                    console.log("create data completed")
                } else {
                    alertBox.fire({
                        title: "Error",
                        text: "Create data uncomplete",
                        icon: "error",
                    })
                    console.log("create data uncompleted : " + res.data.message);
                }
            }
        } catch (e) {
            alertBox.fire({
                title: "Error..!!",
                text: e,
                icon: "error",
            })
        }
    }; // end handleSave

    return (
        <div>
            {/* <Home state={"company"}> */}
                <h4 className="text-light">ข้อมูลร้านค้า</h4>
                <div style={{ width: "25em" }} className="text-light">
                    <form onSubmit={handleSave}>
                        <div className="mt-4">
                            <label htmlFor="cname" className="ps-2">Company Name</label>
                            <input onChange={(e) => setName(e.target.value)} id="cname" className="form-control" value={cname} placeholder={empty} required ></input>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="cphone" className="ps-2">Phone</label>
                            <input onChange={(e) => setPhone(e.target.value)} id="cphone" className="form-control" value={phone} placeholder={empty} required ></input>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="caddress" className="ps-2">Address</label>
                            <input onChange={(e) => setAddress(e.target.value)} id="caddress" className="form-control" value={address} placeholder={empty} required ></input>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary mt-2"><i className="fa fa-check me-2"></i>SAVE</button>
                        </div>
                    </form>
                </div>
            {/* </Home> */}
        </div>
    )
}

export default Company;