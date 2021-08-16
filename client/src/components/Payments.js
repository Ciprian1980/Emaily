import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

class Payments extends Component {
    render() {
        debugger;
        return (
            <StripeCheckout
                amount={500}
                //token coming back from stripe
                token={token => console.log('this is the token:', token)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            />
        )
    }
} 
export default Payments;