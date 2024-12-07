function Myform(){
    const submit= (e)=>{
        let inputValue = document.getElementById("input").value;
        e.preventDefault(); // เพื่อไม่ให้หน้าจอรีเฟรซ
        console.log("input : "+ inputValue);
        document.getElementById("display").innerHTML = "input : "+ inputValue;
    };
    return(
        <div>
            <form onSubmit={submit}>
                <input id="input" />
                <button>Submit</button>
            </form>
            <p id="display"></p>
        </div>
    )
}

export default Myform;