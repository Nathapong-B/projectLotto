//import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Testcomp() {
  let [data, setData] = useState([]);
  //let data_arr;
  //let dataArr;
  //const show = document.getElementById("show");

  // const Getcomp = async () => {
  // axios.get("http://localhost:3000/api/app/").then((res) => {
  //   const show = document.getElementById("msg");
  //   setData(res.data);
  //   show.innerHTML = "ข้อมูลทั้งหมด : "+data.length;
  //     //console.log(res.data);
  //     //data_arr = res.data;
  //     // data_arr.map((e) => {
  //     //   setData((i) => [...i, e])
  //     // })
  //   }).catch((err) => {
  //     console.log(err)
  //})
  // }

  useEffect(() => {
    axios.get("http://localhost:3000/api/app/")
      .then(res => {
        setData(res.data)

        const show = document.getElementById("msg");
        show.innerHTML = "ข้อมูลทั้งหมด : " + res.data.length;
        console.log(data);
      })
    //   // fetch("http://localhost:3000/api/app/").then(res=>res.json()).then(data=>setData(data))
    //   //   console.log("data : "+data);
    //   //data_arr = res.data;
    //   //console.log("res : "+res.data.length)
    //   //console.log("data_arr : "+res.json)
    //   //console.log("ข้อมูลใน dataArr : " + data_arr[0].id + " , name : " + data_arr[1].name)
    //   // data_arr.map((e) => {
    //   //   setData((i) => [...i, e])
    //   // })
  }, []);

  return (
    //console.log("return dataArr : " + data_arr + " , name : " + data_arr),
    <div>
      {data.map((e, i) => {
        return (
          <div key={i}>
            <li>ID : {e.id} , Name : {e.name}</li>
          </div>
        )
      })}
      <p>...Testcomp...</p>
      <p id="show"></p>
    </div>
  )

}

function App() {
  const api = "http://localhost:3000/api/app" //สร้างตัวแปรเก็บค่าเพื่อเชื่อมต่อ api

  const Get = async () => {
    await axios.get(api).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  const Post = async () => {
    await axios.post(api, { name: "new item" }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  const Put = async () => {
    await axios.put(api + "/5", { name: "item edit" }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  const Delete = async () => {
    await axios.delete(api + "/2").then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="App">
      <div><h1>Connect API</h1></div>
      <button onClick={Get}>Get</button>
      <button onClick={Post}>Post</button>
      <button onClick={Put}>Put</button>
      <button onClick={Delete}>Delete</button>
      <p id="msg">..</p>
      <Testcomp />
    </div>
  );
}

export default App;
