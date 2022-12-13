import React, { useState } from "react";
import Cart from "../components/cart";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

import RestaurantList from "../components/restaurantList";
import { InputGroup, InputGroupAddon, Input } from "reactstrap";

const cache = new InMemoryCache();

const API_URL = "https://philip-restaurantapp/graphql";

const client = new ApolloClient({
  uri: API_URL,
  cache: cache,
});

function Home() {
  const [query, setQuery] = useState("");
  const [showInput, setShowInput] = useState(true);

  return (
    <ApolloProvider client={client}>
      <div className="search">
        {showInput && (
          <div>
            <h2> Local Restaurants</h2>
            <InputGroup>
              <InputGroupAddon addonType="append"> Search </InputGroupAddon>
              <Input
                onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
                value={query}
              />
            </InputGroup>
          </div>
        )}
        <br></br>
      </div>
      <RestaurantList
        search={query}
        setShowInput={setShowInput}
        setQuery={setQuery}
      />
      <Cart> </Cart>
    </ApolloProvider>
  );
}
export default Home;
