import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import WishlistCard from "../../components/WishlistCard/WishlistCard";
import { useCart, usePricing } from "../../contexts/cart";
import styled from "@emotion/styled";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { formatMoney } from "../../utils/format";
import fakeStore from "../../api/fakeStore";
import { sortBy, uniqBy } from "lodash/fp";
import { Button } from "../../components/ProductCard/ProductCard";

const sortById = sortBy(({ wishlist }) => wishlist.id);
const uniqById = uniqBy("id");

export default function CheckoutPage() {
  const { submit, rejectWishlist, loading: cartLoading } = useCart();
  const [wishlistId, setWishlistId] = useState();
  const [loading, setLoading] = useState(false);
  const wishlistSectionRef = useRef();

  const [wishlists, dispatch] = useReducer((prevState, { type, payload }) => {
    switch (type) {
      case "ADD_WISHLIST": {
        const newItem = { wishlist: payload, products: [...payload.products] };
        return sortById([...prevState, newItem]);
      }

      case "REMOVE_WISHLIST": {
        return prevState.filter(({ wishlist }) => wishlist.id !== payload.id);
      }

      case "REMOVE_PRODUCT": {
        const wishlistFound = prevState.find(
          ({ wishlist }) => wishlist.id === payload.wishlistId
        );

        if (!wishlistFound) {
          return prevState;
        }

        const withoutWishlist = prevState.filter(
          ({ wishlist }) => wishlist.id !== payload.wishlistId
        );

        const products = wishlistFound.products.filter(
          (p) => p.id !== payload.productId
        );

        return products.length
          ? sortById([{ ...wishlistFound, products }, ...withoutWishlist])
          : withoutWishlist;
      }

      default:
        return prevState;
    }
  }, []);

  const addWishlist = async (wishlistId) => {
    if (wishlists.find(({ wishlist }) => wishlist.id === wishlistId)) {
      return;
    }

    const addCart = (cart) => dispatch({ type: "ADD_WISHLIST", payload: cart });
    setLoading(true);

    return fakeStore
      .fetchCart(wishlistId)
      .then(addCart)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const discounts = useMemo(() => {
    const allProducts = uniqById(
      wishlists.reduce((acc, it) => [...acc, ...it.products], [])
    );

    return allProducts.reduce((acc, product) => {
      const quantity = wishlists.filter(({ products }) => {
        return products.map((p) => p.id).includes(product.id);
      }).length;

      return { ...acc, [product.id]: quantity > 1 ? quantity : 0 };
    }, {});
  }, [wishlists]);

  const { total, subTotal, totalDiscounts } = usePricing(wishlists);

  useEffect(() => {
    wishlistSectionRef.current?.scrollTo({
      behavior: "smooth",
      top: wishlistSectionRef.current?.scrollHeight,
    });
  }, [wishlists.length]);

  return (
    <Content>
      <LeftMenu>
        <Col>
          <InputField
            type="numeric"
            disabled={loading}
            value={wishlistId || ""}
            placeholder="Insert a wishlist id..."
            onChange={({ target: { value } }) => {
              const candidate = Number(value);
              if (Number.isInteger(candidate)) setWishlistId(candidate);
            }}
          />
          <Button
            disabled={!wishlistId || loading}
            style={{ marginTop: 8, borderRadius: 4, backgroundColor: "white" }}
            onClick={() =>
              addWishlist(wishlistId).then(() => setWishlistId(""))
            }
          >
            {loading ? "Loading" : "Add Wishlist"}
          </Button>
        </Col>

        <Col>
          <span
            style={{ marginTop: 32, fontWeight: "bold", textAlign: "right" }}
          >
            SUB-TOTAL: $ {formatMoney(subTotal)}
          </span>
          <span
            style={{ marginTop: 16, fontWeight: "bold", textAlign: "right" }}
          >
            -$ {formatMoney(totalDiscounts)}
          </span>
          <span
            style={{ marginTop: 16, fontWeight: "bold", textAlign: "right" }}
          >
            TOTAL: $ {formatMoney(total)}
          </span>

          <PlaceOrderButton
            disabled={cartLoading}
            style={{ marginTop: 16 }}
            onClick={() => submit(wishlists)}
          >
            <span>{cartLoading ? "Loading..." : "Place Order"}</span>
          </PlaceOrderButton>
        </Col>
      </LeftMenu>

      <WishlistSection ref={wishlistSectionRef}>
              <AnimateSharedLayout>
              <h1 style={{ fontSize: 16, marginTop: 8 }}>
                Droppe Xmas 
                              </h1>
          <AnimatePresence>
                    {wishlists.map((item) => (
              <WishlistCard
                key={item.wishlist.id}
                {...{ ...item, discounts }}
                onDeleted={(wishlist) => {
                  dispatch({ type: "REMOVE_WISHLIST", payload: wishlist });
                  rejectWishlist(item);
                }}
                onProductRemoved={({ id }) =>
                  dispatch({
                    type: "REMOVE_PRODUCT",
                    payload: { productId: id, wishlistId: item.wishlist.id },
                  })
                }
              />
            ))}
          </AnimatePresence>
        </AnimateSharedLayout>
      </WishlistSection>
    </Content>
  );
}

const Content = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const PlaceOrderButton = styled(Button)`
  border-radius: 4px;
  padding: 16px 32px;

  background-color: rgb(113, 105, 105);
  box-shadow: 4px 8px 12px 6px rgba(15, 15, 15, 0.3);

  span {
    text-transform: uppercase;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputField = styled.input`
  padding: 8px;
  border-radius: 4px;

  border: none;
  outline: none;

  background-color: rgba(255, 255, 255, 0.5);
`;

const LeftMenu = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2d2e2e;
  min-width: 220px;

  padding: 32px;

  span {
    color: white;
  }
`;

const WishlistSection = styled.section`
  flex: 1;
  padding: 64px;
  padding-top: 12px;
  flex-direction: column;
  justify-content: center;

  overflow: auto;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"%3E%3Cpath fill="%239C92AC" fill-opacity="0.4" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"%3E%3C/path%3E%3C/svg%3E');
  > h1 {
    border-radius: 4px;
  padding: 16px 32px;

  background-color: rgb(113, 105, 105);
  box-shadow: 4px 8px 12px 6px rgba(15, 15, 15, 0.3);
  font-size: 62px;
  font-weight: bold;
  font-family: "Fraunces";
text-align: center;
   margin-bottom: 32px;

  }
  > div {
    margin-top: 64px;
  }

  > div:first-of-type {
    margin: 0;
  }
  
  

  @media (max-width: 768px) {
    padding: 32px;
    padding-top: 64px;
  }
`;
