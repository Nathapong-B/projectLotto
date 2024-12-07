import { Link } from "react-router-dom";

export default function TermCondition() {
    return (
        <div>
            <div className="container-md">
                <p className="w-75 mx-auto h3 mt-4 fw-bold text-light">Term and Condition</p>
                <div className="w-75 bg-light mx-auto mb-5 rounded p-3 shadow">
                    <p>5555555</p>
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