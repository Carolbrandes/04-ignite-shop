import { useParams } from 'next/navigation';

export default function Product() {
    const params = useParams();

    // Check if params exists and has an id
    if (!params || !params.id) {
        return <div>Loading...</div>;
    }

    const { id } = params;
    console.log("🚀 ~ Product ~ id:", id);

    return (
        <div>
            <h1>Product ID {id}</h1>
        </div>
    );
}