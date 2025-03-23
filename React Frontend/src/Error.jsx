import React from 'react'


const Error = () => {
    return (
        <div className='min-vw-100 min-vh-100 bg-light fs-1 fw-bold align-items-center justify-content-center'>
            <img className='min-vw-100 min-vh-100'
                src="/404_page_cover.jpg" // Path relative to the public folder
                alt="Error Illustration"
                style={{ width: '300px', height: 'auto' }} // Optional: Add styling
            />
        </div>
    )
}

export default Error