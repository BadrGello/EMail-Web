// EmailPage.js
import React, { useEffect, useState } from 'react';

function EmailPage() {

    useEffect(() => {
        const fetchData = async () => {
            try {
                
            } 
            catch (error) {
                console.error('Error fetching data');
            }
        };

        fetchData();
    }, []);

    return (
        <div className='container fullpage'>
        <h2>Welcome</h2>
        
        </div>
    );
}

export default EmailPage;
