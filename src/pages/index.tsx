import { GetStaticProps } from 'next';

import Head from 'next/head';

import styles from './home.module.scss';

import {SubscribeButton} from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}:HomeProps) {

  return (
    <>
      <Head>
        <title>Home | ig.News</title>
      </Head>
      <main className={styles.contentConatiner}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the plucations <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1J1ftVHpTiblvV8jLKO1Yl56') 

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD' 
    }).format(price.unit_amount / 100),
  }
  
  return {
    props:{
     product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}