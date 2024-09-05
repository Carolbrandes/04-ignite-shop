import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';
import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stripe from 'stripe';
import { stripe } from '../../lib/stripe';

interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        defaultPriceId: string
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
    const { isFallback } = useRouter()


    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)

            const response = await axios.post("/api/checkout", {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl

        } catch (error) {
            //* Conectar com uma ferramenta de observalidade (Datadog, Sentry)

            setIsCreatingCheckoutSession(false)
            alert("Falha ao redirecionar ao checkout!")
        }
    }

    if (isFallback) return <p>Loading...</p>

    return (
        <ProductContainer>
            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={480} alt="" />
            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>

                <p>{product.description}</p>

                <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
            </ProductDetails>
        </ProductContainer>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    // pode carregar nos paths os 5 produtos mais vendidos, mais acessados
    return {
        paths: [
            { params: { id: 'prod_QdHKr7obozdrx0' } }
        ],
        fallback: true
    }
}


export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = params?.id

    let product = {} as any

    if (productId) {

        product = await stripe.products.retrieve(productId, {
            expand: ['default_price']
        })


        const price = product.default_price as Stripe.Price;

        product = {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: price?.unit_amount
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(price.unit_amount / 100)
                : 'Preço não disponível', // Fallback if unit_amount is null or undefined
            description: product.description,
            defaultPriceId: price.id
        };

    }


    return {
        props: { product },
        revalidate: 60 * 60 * 1 // 1 hour
    }
}