import React from 'react';
import {useParams} from 'react-router-dom';

function ServerDetailPage() {
    const {server} = useParams();
    return <>
        {server}
    </>;
}

export default ServerDetailPage;