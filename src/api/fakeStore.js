import { setup } from "axios-cache-adapter";
import { format } from "date-fns";
import { random } from "lodash";

class FakeStoreApi {
  constructor() {
    this.client = setup({
      baseURL: "https://fakestoreapi.com",
      cache: {
        maxAge: 15 * 60e3, // 15 Minutes
      },
    });
  }

  async fetchCart(cartId) {
    const cart = await this.client
      .get(`/carts/${cartId}`)
      .then((res) => res.data);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const products = await Promise.all(
      cart.products.map(({ productId }) => this.fetchProduct(productId))
    );

    return { ...cart, products };
  }

  async fetchProduct(productId) {
    return this.client.get(`/products/${productId}`).then((res) => res.data);
  }

  async submitBasket(products) {
    const payload = {
      products,
      userId: random(0, 1000, false),
      date: format(new Date(), "yyyy-MM-dd"),
    };

    return this.client.post("/carts", payload).then((res) => res.data);
  }
}

const fakeStore = new FakeStoreApi();

export default fakeStore;
