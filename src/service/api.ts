import axios from 'axios';

export async function ApiLogin(data: FormData) {
    try {
        const axiosResponse = await axios.post('http://localhost:8080/login',
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
        const axiosResponse = await axios.post('http://localhost:8080/user',
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
