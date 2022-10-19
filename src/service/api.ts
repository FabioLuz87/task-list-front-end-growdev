import axios from 'axios';

type respSignUp = {
    msg: string,
    id: string,
    name: string
}

export async function ApiLogin(data: FormData) {
    try {
        const axiosResponse = await axios.post(process.env.REACT_APP_URL + '/login',
        {
            email: data.get('email'),
            pass: data.get('password'),
        });

        localStorage.setItem("currentUser", "");
        localStorage.setItem("currentUser", JSON.stringify(axiosResponse.data.id));

        return true;
    } catch (error: any) {
        alert(error.response.data);
        return false;
    }
};

export async function ApiSignUp(data: FormData) {

    try {
        const axiosResponse = await axios.post(process.env.REACT_APP_URL + '/user',
        {
            name: data.get('name'),
            email: data.get('email'),
            pass: data.get('password'),
        });
        
        alert(axiosResponse.data.msg);

        localStorage.setItem("currentUser", "");
        localStorage.setItem("currentUser", JSON.stringify(axiosResponse.data.id));
        
        return true;
    } catch (error: any) {
        alert(error.response.data);
        return false;
    }
}
