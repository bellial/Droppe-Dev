import React from "react";
import { useCart, usePricing } from "../contexts/cart";
import { formatMoney } from "../utils/format";

export default function ConfirmationPage() {
  const { approvedWishlists } = useCart();
  const { rejectWishlist } = useCart();
  const { total, totalDiscounts } = usePricing(approvedWishlists);

  return (
    <span style={{overflow: "auto", flex: 1,
    padding: "64px",
    paddingTop: "128px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"%3E%3Cpath fill="%239C92AC" fill-opacity="0.4" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"%3E%3C/path%3E%3C/svg%3E')`
  }}>
      <span>Order Placed</span>
      <span>Total $ {formatMoney(total)}</span>
      <span>Total Discounts $ {formatMoney(totalDiscounts)}</span>
    </span>
  );
}
