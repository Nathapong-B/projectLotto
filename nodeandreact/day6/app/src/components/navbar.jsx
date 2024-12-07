import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div>
            <Link to={'/'} >home</Link><br />
            <Link to="/myinput">my input</Link><br />
            <Link to="/testreducer">Test Reducer</Link><br />
            <Link to="/myuseeffect">My useeffect</Link><br />
        </div>
    )
}

export default Navbar;