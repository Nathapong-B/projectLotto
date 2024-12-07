import Navbar from './components/navbar';
import './hello.css';

function Hello() {
    return (
        <>
            <Navbar />
            <div className='container'>
                <h1>Hello React</h1>
                <div className='two'><span>test margin</span></div>
            </div>
        </>
    )
}

export default Hello;