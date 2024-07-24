"use client"

import { useParams } from 'next/navigation';
import { useEffect } from 'react';


export default function Product() {
    const params = useParams();
    const { id } = params;
    console.log("🚀 ~ Product ~ id:", id)


    useEffect(() => {
        console.log("🚀 ~ Product ~ params:", params)
    }, [params])


    return (
        <div>
            <h1>Product ID {id}</h1>
        </div>
    );
}



