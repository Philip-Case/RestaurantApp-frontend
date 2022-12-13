import { useContext, useState } from "react";
import Head from "next/head";
import AppContext from "../components/context";
import Home from "./index";
import Layout from "../components/layout";
import Cookie from "js-cookie";

function MyApp(props) {
  var { cart, addItem, removeItem, user, setUser, isAuthenticated, clearCart } =
    useContext(AppContext);
  const [state, setState] = useState({ cart: cart });
  const [userSignedin, setUserSignedIn] = useState({});
  const [authed, setAuthed] = useState(false);
  const { Component, pageProps } = props;

  setUser = (currentUser) => {
    setUserSignedIn(currentUser);
    if (currentUser) {
      setAuthed(true);
    }
  };

  clearCart = () => {
    setState({ cart: { items: [], total: 0 } });
  };

  addItem = (item) => {
    let { items } = state.cart;
    let foundItem = true;
    if (items.length > 0) {
      foundItem = items.find((i) => i.id === item.id);
      if (!foundItem) foundItem = false;
    } else {
      foundItem = false;
    }
    if (!foundItem) {
      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      var newCart = {
        items: [...state.cart.items, temp], //copy of item is added to cart with QTY of 1
        total: state.cart.total + item.price,
      };
      setState({ cart: newCart }); //state updated
    } else {
      newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity + 1 });
          } else {
            return item;
          }
        }),
        total: state.cart.total + item.price,
      };
    }
    setState({ cart: newCart });
  };

  removeItem = (item) => {
    let { items } = state.cart;
    const foundItem = items.find((i) => i.id === item.id);
    if (foundItem.quantity > 1) {
      var newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity - 1 });
          } else {
            return item;
          }
        }),
        total: state.cart.total - item.price,
      };
    } else {
      const index = items.findIndex((i) => i.id === foundItem.id);
      items.splice(index, 1);
      var newCart = { items: items, total: state.cart.total - item.price };
    }
    setState({ cart: newCart });
  };

  return (
    <AppContext.Provider
      value={{
        cart: state.cart,
        addItem: addItem,
        removeItem: removeItem,
        isAuthenticated: authed,
        user: userSignedin,
        setUser: setUser,
        clearCart: clearCart,
      }}
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
