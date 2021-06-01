import Axios from "axios";

const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    let userId;

    const baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
    }
    const tokenRes = await Axios.post(
        baseURL + "/user/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
    );
    if (tokenRes.data) {
        const userRes = await Axios.get(baseURL + "/user/", {
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