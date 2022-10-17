import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Log-in';
import SignUp from './pages/Sign-up';
import TasksPage from './pages/Tasks';

export default function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/sign-up' element={<SignUp/>} />
                <Route path='/task-page' element={<TasksPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

