import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';
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
        <ProductContainer>
            <ImageContainer></ImageContainer>

            <ProductDetails>
                <h1>Camiseta x</h1>
                <span>R$ 79,90</span>

                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos praesentium blanditiis rem ratione dolorum consectetur eos voluptates error assumenda doloribus aspernatur voluptatum dignissimos at cumque qui, autem recusandae, fugit sequi?</p>

                <button>Comprar agora</button>
            </ProductDetails>
        </ProductContainer>
    );
}