import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { login, register } from './store';
import { logineval, joblisting, registeruser } from "./utils";
import { useNavigate } from 'react-router-dom';
import { jobload } from './store';
import { useSelector } from 'react-redux';



const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef(null);
    const formRef2 = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const values = useSelector((state) => state);


    const handlelogin = async (e) => {
        e.preventDefault();
        dispatch(login(username, password));
        const user_details = { 'username': username, 'password': password, 'logout': 1 }
        window.localStorage.setItem('user-details', JSON.stringify(user_details));
        console.log("username", values.username)
        const responsemessage = await logineval(username, password);
        setMessage(responsemessage)
        console.log("MEssage", message)
        formRef.current.reset();
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000)
        console.log("printing from local storage", JSON.parse(window.localStorage.getItem('user-state')))
        if (responsemessage === 'Login successful!') {
            const jobs = await joblisting(dispatch)
            dispatch(jobload(jobs))
            console.log("after response")
            navigate('/Scheduler');
        }
    }



    const handleregister = async (e) => {
        e.preventDefault();
        console.log("inside handleregister")
        dispatch(register(username, email, password, confirmpassword));
        const user_details = { 'username': username, 'password': password, 'email': email, 'confirmpassword': confirmpassword, 'logout': 1 }
        window.localStorage.setItem('user-details', JSON.stringify(user_details));
        console.log("username", values.username)
        const responsemessage = await registeruser(username, email, password, confirmpassword);
        setMessage(responsemessage)
        console.log("MEssage", message)
        formRef2.current.reset();
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000)
        console.log("printing from local storage", JSON.parse(window.localStorage.getItem('user-state')))
        if (responsemessage) {
            //const jobs = await joblisting(dispatch)
            //dispatch(jobload(jobs))
            console.log("responsemessage of REgister", responsemessage)
            //navigate('/Scheduler');
        }
    }




    return (
        <div className="d-flex flex-column justify-content-center bg-dark align-items-center min-vh-100" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", height: "100vh" }}>

            <div className="d-flex flex-column flex-md-row justify-content-center  bg-transparent  border w-75 border-black rounded" >

                {/* Login Form */}
                <div className="d-flex flex-column align-items-center bg-primary w-100 mt-5 mt-md-2">
                    <h1 className="text-white fw-bold mb-4 fs-3 p-3 mt-2">Login</h1>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 p-4 mx-2 d-flex flex-column w-100" style={{ flexGrow: 1, minHeight: "50vh" }}>
                        <form ref={formRef} className="w-100 d-flex flex-column justify-content-between">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputUsername" className="text-white fw-bold">Username</label>
                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    id="exampleInputUsername"
                                    placeholder="Enter Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputPassword1" className="text-white fw-bold">Password</label>
                                <input
                                    type="password"
                                    className="form-control bg-light"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-center w-100 mt-auto">
                                <button type="submit" className="btn btn-light w-50 py-2" onClick={handlelogin}>Submit</button>
                            </div>
                        </form>
                        {message && <div className='message text-black fw-bold fs-4 mt-3'>{message}</div>}
                    </div>
                </div>

                {/* Signup Form */}
                <div className="d-flex flex-column align-items-center bg-light border border-black w-100 mt-5 mt-md-2">
                    <h1 className="text-primary fw-bold mb-4 fs-3 p-3 mt-2">Signup</h1>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 p-4 mx-2 d-flex flex-column w-100" style={{ flexGrow: 1, minHeight: "50vh" }}>
                        <form ref={formRef2} className="w-100 d-flex flex-column justify-content-between">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputusername" className="text-primary fw-bold">Username</label>
                                <input
                                    type="text"
                                    className="form-control text-black bg-secondary"
                                    id="exampleInputusername"
                                    placeholder="Enter Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail2" className="text-primary fw-bold">Email address</label>
                                <input
                                    type="email"
                                    className="form-control text-black bg-secondary"
                                    id="exampleInputEmail2"
                                    placeholder="Enter Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputPassword2" className="text-primary fw-bold">Password</label>
                                <input
                                    type="password"
                                    className="form-control text-black bg-secondary"
                                    id="exampleInputPassword2"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleconfirmPassword2" className="text-primary fw-bold">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control text-black bg-secondary"
                                    id="exampleconfirmPassword2"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-center w-100 mt-auto">
                                <button type="submit" className="btn btn-primary w-50 py-2" onClick={handleregister}>Submit</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register