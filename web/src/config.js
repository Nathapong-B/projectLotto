const config = {
    apiPath: "http://localhost:3001",
    headers: () => {
        return {
            headers: {
                //Authorization: "Bearer " + token
                Authorization: "Bearer " + localStorage.getItem('lottoToken')
                // Auth: localStorage.getItem('lottoToken') //ส่งค่าแบบ Headers ตัวแปรตั้งเป็น Auth ต้องตั้งชื่อให้ตรงกัน(user.controller(@get(info)))
            }
        };
    },
    user: {
        name: "",
        user: "",
        pwd: "",
        email: "",
        phone: "",
        address: "",
    },
    handleLogout : () => {
        localStorage.removeItem('lottoToken')
        window.location.reload()
    },

    test: { headers: { Authorization: "Bearer " + localStorage.getItem('lottoToken') } }
};

export default config;