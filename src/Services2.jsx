import React, {useEffect, useState} from 'react';

const Services2 = () => {

    const [data,setData] = useState([]);

    useEffect(() => {
        fetch('/data.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(json => setData(json.about))
            .catch(err => console.error("Error fetching about data:", err));
    }, []);
    return (
        <div>

        </div>
    );
};

export default Services2;