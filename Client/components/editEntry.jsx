import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const EditEntry = () => {

    return (
        <div className='homepage'>
            <div className='left-side'></div>

            <div className='main'>
                <header>
                    <h1>Edit!</h1>
                </header>
                <textarea />
                <div>
                    <button>Edit Entry</button>
                    <button>Clear Entry</button>
                </div>
            </div>

            <div className='right-side'></div>
        </div>
    )
}

export default EditEntry;