import { Link, createSearchParams } from "react-router-dom";

export default function TestSendParams() {
    return (
        <div>
            <h3 className="text-center text-light m-4">Test Send Params</h3>
            <Link to={{
                pathname: "/test-received-params",
                search: `?${createSearchParams({ id: "015",name:"jimmy" })}`
            }}>
                <button className="btn btn-primary" >go testpage</button>
            </Link>
        </div>
    )
}