import axios from 'axios';

export type respSignUp = {
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

        const res:respSignUp = axiosResponse.data

        localStorage.setItem("currentUser", "");
        localStorage.setItem("currentUser", JSON.stringify(res));

        return true;
    } catch (error: any) {       
        alert(error.response.data.err);
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

        const res:respSignUp = axiosResponse.data
        
        alert(axiosResponse.data.msg);

        localStorage.setItem("currentUser", "");
        localStorage.setItem("currentUser", JSON.stringify(res));
        
        return true;
    } catch (error: any) {
        alert(error.response.data.err);
        return false;
    }
}
