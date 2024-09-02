import Image from "next/image";
import { HomeContainer, Product } from "../styles/pages/home";

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">

      {
        products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} legacyBehavior>
            <Product className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt={product.name} />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))
      }


    </HomeContainer>
  );
}

//* em ambiente de desenvolvimento o getStaticProps funcionando igual o server side
//* qd estamos usando static generarion nao temos acesso ao ctx da requisicao, nem ao res e nem ao req como no ssr. Entao nao teriamos acesso ao email de um usuario, cookies, headers. Ele funciona qd fazemos o build da aplicacao. Aqui as paginas vao ser iguais para todos usuario que acessarem ela. 
export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });
  console.log("🚀 ~ getStaticProps ~ response:", response.data);

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price?.unit_amount
        ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100)
        : 'Preço não disponível', // Fallback if unit_amount is null or undefined
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
