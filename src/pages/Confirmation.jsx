import React from "react";
import { useCart, usePricing } from "../contexts/cart";
import { formatMoney } from "../utils/format";

export default function ConfirmationPage() {
  const { approvedWishlists } = useCart();
  const { total, totalDiscounts } = usePricing(approvedWishlists);

  return (
    <span>
      <span>Order Placed</span>
      <span>Total $ {formatMoney(total)}</span>
      <span>Total Discounts $ {formatMoney(totalDiscounts)}</span>
    </span>
  );
}
