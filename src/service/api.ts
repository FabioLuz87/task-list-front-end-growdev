import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export async function ApiLogin(data: FormData) {
    try {
      
        const axiosResponse = await axios.post('http://localhost:8080/',{
            email: data.get('email'),
            pass: data.get('pass'),
        });

        console.log(axiosResponse.data)

        return true;
    } catch (error) {
        console.log('*****',error);
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

        alert(axiosResponse.data);

        return true;

    } catch (error) {
        console.log(error);
    }
}