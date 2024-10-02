import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export async function POST(req) {
  try {
    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Subscription',
            },
            unit_amount: formatAmountForStripe(5, 'usd'),
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('Referer')}result?session_id={CHECKOUT_SESSION_ID}`,
      
      // Set your custom cancel URL here
      cancel_url: `${req.headers.get('Referer')}cancel-page`,  // <--- Modify this line
    }

    const checkoutSession = await stripe.checkout.sessions.create(params)

    return NextResponse.json(checkoutSession, {
      status: 200,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    })
  }
}