import { useState, FormEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

import { useSelector } from 'react-redux';

import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import {BUTTON_TYPE_CLASSES} from '../button/button.component';

import { PaymentFormContainer, FormContainer, PaymentButton } from './payment-form.styles';

const ifValidCardElement = (card: StripeCardElement | null): card is StripeCardElement => card !== null;


const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const amount = useSelector(selectCartTotal);
    const currrentUser = useSelector(selectCurrentUser);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // so the button is only avaliable when it should be enough info to pay

    const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verify if the hooks stripe and elements are set up
        if(!stripe || !elements) {
            return;
        }

        setIsProcessingPayment(true);

        const response = await fetch('/.netlify/functions/create-payment-intent', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount * 100 }) //cents value for stripe
        }).then((res) => res.json());

        const {
            paymentIntent: {client_secret},
        } = response;

        const cardDetails = elements.getElement(CardElement);

        if(!ifValidCardElement(cardDetails)) return;

        const paymentResult = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: cardDetails,
                billing_details: {
                    name: currrentUser ? currrentUser.displayName : 'Guest', //can add more info, but we dont need that for now
                },
            },
        });

        setIsProcessingPayment(false);


        if(paymentResult.error) {
            alert(paymentResult.error);
        } else {
            if(paymentResult.paymentIntent.status === 'succeeded') {
                alert('payment sucessful')
            }
        }
    }

    return (
        <PaymentFormContainer>
            <FormContainer onSubmit={paymentHandler}>
                <h2>Credit Card Payment: </h2>
                <CardElement />
                <PaymentButton isLoading={isProcessingPayment} buttonType={BUTTON_TYPE_CLASSES.inverted}> 
                    Pay now 
                </PaymentButton>
            </FormContainer>
        </PaymentFormContainer>
    )
}

export default PaymentForm;