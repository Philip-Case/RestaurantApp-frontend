/* pages/checkout.js */

import React, { useContext } from "react";
import { Row, Col } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import Cart from "../components/cart";

function Checkout() {
  const { isAuthenticated, user } = useContext(AppContext);
  const stripePromise = loadStripe(
    "pk_test_51LqK1dKVm6M2nBCTbFPFnGf6rvB4RiIijJdNoIu8hhPS3UIGPHdIHv10rM3YATncNV8h8W0ZSGY6xyQFn9hjnmQ100rQ6sReav"
  );

  return (
    <Row>
      <Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Cart isAuthenticated={isAuthenticated} user={user} checkout={true} />
      </Col>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Col>
    </Row>
  );
  // }
}
export default Checkout;
