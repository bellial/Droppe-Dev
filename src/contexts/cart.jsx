import { uniqBy } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router";
import fakeStore from "../api/fakeStore";

const CartContext = createContext();

const initialState = {
  loading: false,
  approvedWishlists: [],
  rejectedWishlists: [],
};

export default function CartProvider({ children }) {
  const [state, setCartState] = useState(initialState);
  const history = useHistory();

  const rejectWishlist = (wishlist) => {
    setCartState((prevState) => ({
      ...prevState,
      rejectedWishlists: [...prevState.rejectedWishlists, wishlist],
    }));
  };

  const submit = useCallback(
    async (wishlists) => {
      setCartState((prev) => ({ ...prev, loading: true }));

      try {
        /** Save both approved and discarded carts per child to the API */
        await Promise.all(
          wishlists.map((wishlist) =>
            fakeStore.submitBasket(
              wishlist.products.map((p) => ({ productId: p.id, quantity: 1 }))
            )
          )
        );

        await Promise.all(
          state.rejectedWishlists.map((wishlist) =>
            fakeStore.submitBasket(
              wishlist.products.map((p) => ({ productId: p.id, quantity: 1 }))
            )
          )
        );

        setCartState((prev) => ({ ...prev, approvedWishlists: wishlists }));
        history.push("/confirmation");
      } finally {
        setCartState((prev) => ({ ...prev, loading: false }));
      }
    },
    [history, state.rejectedWishlists]
  );

  return (
    <CartContext.Provider value={{ ...state, submit, rejectWishlist }}>
      {children}
    </CartContext.Provider>
  );
}

export function usePricing(wishlists) {
  return useMemo(() => {
    /**
     * The user should get a discount if there are identical products
     * on * different childrens carts and the user approves these wishes
     *  2 identical products chosen => 20% reduction for the sum of those two items
     *  3 identical products chosen => 30% reduction and so on
     */

    const allProducts = uniqBy(
      wishlists.reduce((acc, { products }) => [...acc, ...products], []),
      "id"
    );

    const productsAgg = allProducts.reduce((acc, product) => {
      const quantity = wishlists.filter(({ products }) =>
        products.map((p) => p.id).includes(product.id)
      ).length;

      return [...acc, { product, quantity }];
    }, []);

    const calcTotal = (applyDiscount) => (acc, { quantity, product }) => {
      const productTotal = quantity * product.price;

      if (applyDiscount && quantity > 1) {
        // Apply discount
        return acc + productTotal * (1 - 0.1 * quantity);
      }

      return acc + productTotal;
    };

    const subTotal = productsAgg.reduce(calcTotal(false), 0);
    const total = productsAgg.reduce(calcTotal(true), 0);
    const totalDiscounts = productsAgg.reduce((acc, { quantity, product }) => {
      const productTotal = quantity * product.price;
      return quantity > 1 ? acc + productTotal * 0.1 * quantity : acc;
    }, 0);

    return { total, subTotal, totalDiscounts };
  }, [wishlists]);
}

/**
 * Makes possible to read from the cart object
 */
export function useCart() {
  return useContext(CartContext);
}
