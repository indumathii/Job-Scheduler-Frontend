import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useRef, useEffect } from 'react';
import { jobpost, joblisting } from "./utils";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { jobload, login, logout } from './store';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [jobname, setJobname] = useState(null);
    const [priority, setPriority] = useState('Low');
    const [deadline, setDeadline] = useState();
    const [duration, setDuration] = useState(0);
    const [isjob, setIsjob] = useState(0);
    const dispatch = useDispatch();
    const values = useSelector((state) => state);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const dateInputRef = useRef(null);
    let details;

    useEffect(() => {
        const fetchjobs = async () => {
            const jobs = await joblisting(dispatch);
            dispatch(jobload(jobs));
            details = JSON.parse(window.localStorage.getItem('user-details'));
            if (details != null) {
                dispatch(login(details.username, details.password, details.logout))
                console.log("Details in home", details)
            }

        };
        fetchjobs();
        const intervalId = setInterval(fetchjobs, 2000);



        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (details) {
            window.localStorage.setItem('user-details', JSON.stringify(details));
        }
    }, [details]);

    const handleDateChange = (e) => {
        setDeadline(e.target.value);
        dateInputRef.current.blur();
    };

    const handlejobsubmit = async (e) => {
        e.preventDefault();
        const { response, response2 } = await jobpost(jobname, priority, deadline, duration, dispatch)
        if (response || response2) {
            setIsjob(1)
            setTimeout(() => {
                formRef.current.reset();
                setIsjob(0);
            }, 1000)
        }
    }

    const handlelogout = () => {
        window.localStorage.removeItem('user-details');
        window.localStorage.removeItem('user-state');
        dispatch(logout())
        console.log("values in logout hanlde", values);
        navigate("/")

    }


    return (
        <div className="d-flex flex-column bg-dark align-items-center min-vh-100">
            <div className="d-flex flex-column  flex-md-row w-100 z-10">
                <div className=" d-flex justify-content-center align-items-start w-100 w-md-50 text-danger fs-2 fw-bold">Schedule Jobs</div>
                <div className="position-absolute d-flex text-light fs-5 m-1 fw-bold ms-auto gap-3 align-items-center mt-5 mt-md-2" style={{ right: '10px' }}>
                    <div className="text-light">{values.username}</div>
                    <div className="d-flex p-1 bg-danger border rounded" style={{ cursor: 'pointer', backgroundColor: " #d82108" }} onClick={(e) => navigate('/Dashboard')}>Dashboard</div>
                    <div className="d-flex p-1 bg-primary border rounded" style={{ cursor: 'pointer' }} onClick={handlelogout}>Logout</div>
                </div>
            </div>
            <div className="d-flex flex-column top-10 flex-md-row justify-content-sm-start justify-content-md-center align-items-sm-start bg-light m-3 border w-75 h-md-50 h-lg-25 border-danger border-2 rounded mt-5 mt-md-2" >
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 p-4 mx-2 d-flex flex-column w-100" style={{ flexGrow: 1, minHeight: "50vh" }}>
                        <form ref={formRef} className="w-100 d-flex flex-column justify-content-between">
                            <div className="d-flex w-100 flex-column flex-md-colum flex-lg-row form-group mb-4  gap-4 align-items-center">
                                <label htmlFor="jobname" className="text-danger fw-bold ">Job Name</label>
                                <input
                                    type="text"
                                    className=" form-control bg-white border border-black border-2"
                                    id="jobname"
                                    placeholder="Job Name"
                                    onChange={(e) => setJobname(e.target.value)}

                                />
                                <label htmlFor="Priority" className="text-danger fw-bold text-left">Priority</label>
                                <input
                                    type="text"
                                    className="form-control bg-white border text-black border-black border-2"
                                    id="Priority"
                                    placeholder="High, Medium, Low"
                                    onChange={(e) => setPriority(e.target.value)}

                                />
                            </div>
                            <div className="d-flex flex-column flex-md-colum flex-lg-row form-group mb-4  gap-4 align-items-center">
                                <label htmlFor="estimatedduration" className="text-danger fw-bold">Est. Time</label>
                                <input
                                    type="number"
                                    className="ml-2 form-control bg-white text-black border border-black border-2"
                                    id="estimatedduration"
                                    placeholder="Duration in sec"
                                    onChange={(e) => setDuration(e.target.value)}

                                />
                                <label htmlFor="Deadline" className="text-danger fw-bold">Deadline</label>
                                <input
                                    type="datetime-local"
                                    className="form-control bg-white border text-black border-black border-2"
                                    id="Priority"
                                    ref={dateInputRef}
                                    placeholder="Date Time Format"
                                    onChange={handleDateChange}
                                />

                            </div>

                            <div className="d-flex justify-content-center align-items-center w-100 mt-auto">
                                <button type="submit" className="btn btn-primary w-25  py-2" onClick={handlejobsubmit}>Submit</button>
                            </div>
                        </form>
                        {isjob == 1 && <div className='jobcreation text-success fw-bold fs-4 mt-3'>Job Created Successfully</div>}
                    </div>
                </div>

            </div >
            <div className="col-12 col-sm-12 col-md-6  p-4 d-flex justify-content-center align-items-center w-100 p-10 m-10">
                <div className="d-flex flex-wrap gap-4 justify-content-center w-100">
                    {values.jobs?.map((job) => (
                        <div
                            key={job.id}
                            className="card border border-white border-2 d-flex text-light align-items-start col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 p-3 mx-2"
                            style={{
                                background: 'linear-gradient(45deg,rgb(236, 173, 220),hsl(318, 78.80%, 68.60%),hsl(315, 97.60%, 50.60%))',
                                padding: '20px',
                                color: 'white',
                                textAlign: 'center',
                                margin: '10px'
                            }}>
                            <div className="fs-5 fw-bold w-100" style={{ color: '#180aa1' }}>
                                {job.job_name}
                            </div>
                            <div className="d-flex flex-row w-100 mx-2">
                                <div className="mt-1 fw-bold text-dark">Priority:</div>
                                <div className="m-1 fw-bold" style={{ color: '#0d1b80' }}>
                                    {job.priority}
                                </div>
                            </div>
                            <div className="d-flex flex-row w-100 mx-2">
                                <div className="mt-1 fw-bold text-dark">Duration:</div>
                                <div className="m-1 fw-bold" style={{ color: '#0d1b80' }}>
                                    {job.estimated_duration}
                                </div>
                            </div>
                            <div className="d-flex flex-row w-100 mx-2">
                                <div className="mt-1 fw-bold text-dark">Deadline:</div>
                                <div className="m-1 fw-bold" style={{ color: '#0d1b80' }}>
                                    {job.deadline.replace('T', ' ').replace('Z', '')}
                                </div>
                            </div>
                            <div className="d-flex flex-row w-100 mx-2">
                                <div className="mt-1 fw-bold text-dark">Status:</div>
                                <div className="m-1 fw-bold" style={{ color: job.status === "COMPLETED" ? "#0d8a05" : job.status === "RUNNING" ? "red" : job.status === "FAILED" ? "yellow" : job.status === "PENDING" ? "blue" : '#0d1b80' }}>
                                    {job.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div >
    )
}

export default Home