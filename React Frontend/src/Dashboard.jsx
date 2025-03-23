import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { dashboard } from './store';
import { BarChart, Bar, XAxis, PieChart, Pie, Cell, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WebSocketComponent = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [statuses, setStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [average_time, setaverage_time] = useState(0);
    const [limit, setLimit] = useState(5);
    const [jobs, setJobs] = useState([]);
    const [totaljobs, setTotaljobs] = useState([]);
    const dispatch = useDispatch();


    const [chartData, setChartData] = useState([
        { name: 'Low', count: 0 },
        { name: 'Medium', count: 0 },
        { name: 'High', count: 0 },
    ]);

    const [piechartData, setPiechartData] = useState([
        { name: 'Completed', value: 0, fill: '#36A2EB' },
        { name: 'Failed', value: 0, fill: '#FFCE56' },
        { name: 'Pending', value: 0, fill: '#FFCE56' },
        { name: 'Running', value: 0, fill: '#FFCE56' },
    ]);



    useEffect(() => {
        const states = JSON.parse(window.localStorage.getItem('user-state'));
        const user = states ? states.user : null;
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/jobs/${statuses.toUpperCase()}/${user}/${page}/${limit}/`);

        socket.onopen = () => {
            console.log("WebSocket connection opened!");
            setConnectionStatus("Connected");
            socket.send(JSON.stringify({ action: "get_all_jobs" }));
            socket.send(JSON.stringify({ action: "get_filtered_jobs" }));

        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            if (data.message) {
                setMessage(data.message);
            }
            if (data.action === "get_all_jobs" && data.jobs) {

                setTotaljobs(data.jobs);
                console.log("total jobs", totaljobs)
                const lowcount = data.jobs.filter(job => job.priority === 'Low').length
                const mediumcount = data.jobs.filter(job => job.priority === 'Medium').length
                const highcount = data.jobs.filter(job => job.priority === 'High').length
                console.log("lowcount", lowcount)
                console.log("highcount", highcount)


                setChartData([
                    { name: 'Low', count: lowcount },
                    { name: 'Medium', count: mediumcount },
                    { name: 'High', count: highcount },
                ]);


                const completedcount = data.jobs.filter(job => job.status === 'COMPLETED').length
                const pendingcount = data.jobs.filter(job => job.status === 'PENDING').length
                const failedcount = data.jobs.filter(job => job.status === 'FAILED').length
                const runningcount = data.jobs.filter(job => job.status === 'RUNNING').length

                setPiechartData([
                    { name: 'Completed', value: completedcount, fill: '#36A2EB' },
                    { name: 'Failed', value: failedcount, fill: '#FFCE56' },
                    { name: 'Pending', value: pendingcount, fill: '#ee530b' },
                    { name: 'Running', value: runningcount, fill: '#49ee0b' },
                ]);


                let totalExecutionTime = 0
                data.jobs.forEach(job => {
                    console.log("job_execution_time", job.execution_time)
                    totalExecutionTime += job.execution_time;
                })

                setaverage_time((totalExecutionTime / completedcount).toFixed(2));
                console.log("average", average_time)
                console.log("Total jobs:", totaljobs)
                console.log("current jobs:", jobs)
            }

            if (data.action === "get_filtered_jobs" && data.jobs) {

                setJobs(data.jobs);
                console.log("jobs for table", jobs)
                setTotalPages(data.total_pages || 1);
                dispatch(dashboard(statuses, totalPages, data.jobs));
            }
        };

        socket.onerror = (error) => {
            console.log("WebSocket error:", error);
            setConnectionStatus("Error");
        };

        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
            setConnectionStatus("Disconnected");
        };


        return () => {
            console.log("Closing WebSocket connection");
            socket.close();
        };
    }, [statuses, page]);


    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };



    return (
        <div className="">
            <h2 className="d-flex w-100 mx-auto justify-content-center fw-bold align-itmes-center mb-3 mb-md-2 mt-2 mt-md-4" style={{ color: '#ec6208' }}>JOB DASHBOARD</h2>
            <div className="d-flex flex-column mb-3 gap-3">
                <h3 className="d-flex ms-4 ms-md-5 fw-bold" style={{ color: '#6709d1' }}>Job Tracker</h3>
                <div className="w-100  ms-4 ms-md-5">
                    <label className="fw-bold" htmlFor="status" style={{ color: '#06ab10' }}>Filter by Status: </label>
                    <select className="fw-bold align-items-center ms-2  border-2" id="status" value={statuses} onChange={handleStatusChange} style={{ color: '#b2110c', border: 'solid #b2110c' }}>
                        <option value="All">All</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="FAILED">FAILED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="RUNNING">RUNNING</option>
                    </select>
                </div>
            </div>


            {loading ? (
                <p>Loading...</p>
            ) : (

                <div className="container-fluid ms-4 ms-md-5">
                    <div className="d-flex flex-column">
                        <div className="d-flex col-12 col-sm-12 col-md-10 col-lg-8"> {/* Centered and responsive width */}
                            <div className="table-responsive"> {/* Makes the table scrollable on small devices */}
                                <table className="table table-bordered table-sm border-2" style={{ color: '#b2110c', border: 'solid red' }}>
                                    <thead>
                                        <tr className="" >
                                            <th className="text-dark" style={{ border: '2px solid red', backgroundColor: '#2bb805' }}>Job Name</th>
                                            <th className="text-dark" style={{ border: '2px solid red', backgroundColor: '#2bb805' }}>Status</th>
                                            <th className="text-dark" style={{ border: '2px solid red', backgroundColor: '#2bb805' }}>Priority</th>
                                            <th className="text-dark" style={{ border: '2px solid red', backgroundColor: '#2bb805' }}>Estimated Duration (sec)</th>
                                            <th className="text-dark" style={{ border: '2px solid red', backgroundColor: '#2bb805' }}>Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {jobs.slice((page - 1) * limit, page * limit).map((job) => (
                                            <tr key={job.id} style={{ color: '#b2110c', border: 'solid red' }}>
                                                <td className="fw-bold">{job.job_name}</td>
                                                <td>{job.status}</td>
                                                <td>{job.priority}</td>
                                                <td>{job.estimated_duration}</td>
                                                <td>{job.deadline.replace('T', ' ').replace('Z', '')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    <div>
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                            Previous
                        </button>
                        <span> Page {page} of {totalPages} </span>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            )}


            {/* Bar Chart */}
            <div className='d-flex mt-5 me-3 flex-column w-100'>
                <h3 className='d-flex ms-3 m-md-4 ms-md-5 fw-bold' style={{ color: '#6709d1' }}>Job Priority Distribution</h3>
                <ResponsiveContainer width="75%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#ee0b27" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className='d-flex col-12 col-md-8 flex-column flex-md-row w-100'>
                <div className='d-flex col-12 col-md-8 flex-column flex-md-row w-100'>
                    <div className='d-flex m-3  me-3 flex-column'>
                        <h2 className="d-flex ms-1 ms-md-5 mb-2 fw-bold" style={{ color: '#6709d1' }}>Job Status Distribution</h2>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={piechartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            >
                                {piechartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/*Average Time */}

                    <div className='d-flex m-5 flex-column align-items-center ms-auto min-vh-50' style={{ width: '100%' }}>
                        <h2 className="fw-bold" style={{ color: '#6709d1' }}>Average Waiting Time(sec)</h2>
                        <div className="d-flex m-4 fs-1 fw-bold border border-dark border-5 rounded-pill p-4" style={{ color: 'white', backgroundColor: '#ec0899' }}>{average_time}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WebSocketComponent;
