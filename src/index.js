import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import ConfirmationPage from "./pages/Confirmation";
import CheckoutPage from "./pages/Checkout/Checkout";
import CartProvider from "./contexts/cart";
import { SWRConfig } from "swr";
import fakeStoreClient from "./api/fakeStore";

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        suspense: true,
        fetcher: (path) => fakeStoreClient.get(path).then((res) => res.data),
      }}
    >
      <Router>
        <CartProvider>
          <Switch>
            <Route exact path="/confirmation">
              <ConfirmationPage />
            </Route>

            <Route path="/">
              <CheckoutPage />
            </Route>
          </Switch>
        </CartProvider>
      </Router>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
