import { loadStripe } from "@stripe/stripe-js";

//set up stripe for us to use - Public key
export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);