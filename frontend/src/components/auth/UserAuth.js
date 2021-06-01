import Axios from "axios";

const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    let userId;

    if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
    }
    const tokenRes = await Axios.post(
        "http://localhost:5000/user/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
    );
    if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/user/", {
            headers: { "x-auth-token": token },
        });
        userId = {
            token: token,
            user: userRes.data
        };
        console.log(userId);
        return userId;
    }
    else{
        return  {token: "",user:""};
    }

};

export default checkLoggedIn;