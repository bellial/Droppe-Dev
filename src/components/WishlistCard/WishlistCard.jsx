import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import ProductCard, { Button } from "../ProductCard/ProductCard";
import { CgClose, CgChevronUp } from "react-icons/cg";

import { AnimatePresence, motion } from "framer-motion";
import { formatMoney } from "../../utils/format";

export default function WishlistCard({
  wishlist,
  products,
  onDeleted,
  discounts,
  onProductRemoved,
}) {
  const [colapsed, setColapsed] = useState(true);

  const subTotal = useMemo(
    () => products.reduce((acc, product) => acc + product.price, 0),
    [products]
  );

  return (
    <CardContainer
      layout
      exit={{ x: 120, opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      initial={{ x: -120, opacity: 0 }}
    >
      <motion.h1 layout style={{ margin: 32 }}>
        Child #{wishlist.id}
      </motion.h1>

      <AnimatePresence>
        {!colapsed &&
          products.map((product) => (
            <ProductCard
              product={product}
              discount={discounts[product.id]}
              key={`${product.id}_${wishlist.id}`}
              onDeleted={() => onProductRemoved?.(product)}
            />
          ))}
      </AnimatePresence>

      <CardFooter layout>
        <RemoveButton
          initial={{ rotate: 0 }}
          style={{ marginLeft: 16 }}
          animate={!colapsed ? "up" : "down"}
          onClick={() => setColapsed((prev) => !prev)}
          variants={{ up: { rotate: 0 }, down: { rotate: 180 } }}
        >
          <CgChevronUp color="white" size={16} />
        </RemoveButton>

        <div>
          <span style={{ color: "white" }}>
            Sub-Total: $ {formatMoney(subTotal)}
          </span>

          <RemoveButton
            style={{ marginLeft: 16 }}
            onClick={() => onDeleted?.(wishlist)}
          >
            <CgClose color="white" size={16} />
          </RemoveButton>
        </div>
      </CardFooter>
    </CardContainer>
  );
}

const RemoveButton = styled(Button)`
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
`;

const CardFooter = styled(motion.div)`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: grey;
`;

const CardContainer = styled(motion.div)`
  width: 100%;
  flex-direction: column;

  padding-top: 32px;

  display: flex;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 4px 8px 12px 0px rgba(0, 0, 0, 0.05);
  background-color: #fff;

  font-family: Montserrat;

  > div {
    margin-top: 64px;
  }

  > div:first-of-type {
    margin: 0;
  }
`;
