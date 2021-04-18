import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { BiTrash } from "react-icons/bi";
import { formatMoney } from "../../utils/format";

function ProductCard({ product, discount, onDeleted }) {
  return (
    <CardContainer
      layout
      exit={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -30 }}
    >
      <ProductImage whileHover={{ scale: 1.1 }} url={product.image}>
        {discount > 0.1 && (
          <DiscountBadge
            initial={{ rotate: 180, opacity: 0, scale: 0.2 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
          >
            {discount * 10}%
            <br />
            OFF
          </DiscountBadge>
        )}
      </ProductImage>

      <CardContent>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
      </CardContent>

      <CardActions>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onDeleted}
            transition={{ duration: 0.2 }}
            whileHover={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)" }}
          >
            <BiTrash />
          </Button>
        </div>

        <span>
          $ <Price>{formatMoney(product.price)}</Price>
        </span>
      </CardActions>
    </CardContainer>
  );
}

const DiscountBadge = styled(motion.div)`
  border-radius: 50%;
  position: absolute;

  width: 80px;
  height: 80px;

  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddc255;

  color: white;
`;

export const Button = styled(motion.button)`
  border: none;
  border-radius: 50%;
  background-color: transparent;

  min-width: 32px;
  min-height: 32px;

  border: 1px solid rgba(0, 0, 0, 0.05);

  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);

  :focus {
    border: none;
  }
`;

const Price = styled.span`
  font-size: 24px;
  margin-left: 8px;
`;

const CardContainer = styled(motion.div)`
  display: flex;
  padding: 4px 40px;
  position: relative;

  @media (max-width: 768px) {
    align-items: center;
    flex-direction: column;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 32px;

  border-right: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 0px;
    border-right: none;
  }

  h2 {
    font-size: 22px;
    font-weight: bold;

    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
  }

  p {
    margin-top: 8px;
    line-height: 24px;
  }
`;

const CardActions = styled.div`
  display: flex;
  min-width: 128px;
  padding: 0 0 0 16px;
  align-items: flex-end;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    flex-direction: row-reverse;

    margin-top: 16px;
  }
`;

const ProductImage = styled(motion.div)`
  background: ${({ url }) => `url(${url})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;

  border-radius: 3px;
  width: 164px;
  height: 164px;

  :hover {
    filter: grayscale(0%);
  }

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export default React.memo(ProductCard);
