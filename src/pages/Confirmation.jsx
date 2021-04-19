import styled from "@emotion/styled";
import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import WishlistCard from "../components/WishlistCard/WishlistCard";
import { useCart, usePricing } from "../contexts/cart";
import { formatMoney } from "../utils/format";

export default function ConfirmationPage() {
  const { approvedWishlists, rejectedWishlists } = useCart();
  const { totalDiscounts, total } = usePricing(approvedWishlists);

  return (
    <Content>
      <AnimateSharedLayout>
        <Section>
          <Header layout>
            Approved Wishlists
            <h1 style={{ fontSize: 16, marginTop: 8 }}>
                Total $ {formatMoney(total)}
              </h1>
            {totalDiscounts > 0 && (
              <h2 style={{ fontSize: 16, marginTop: 8 }}>
              Savings $ {formatMoney(totalDiscounts)}
            </h2>
            )}
          </Header>
          {approvedWishlists.map((wishlist) => (
            <WishlistCard showActions={false} {...wishlist} />
          ))}
        </Section>

        <Section>
          <Header layout>Rejected Wishlists</Header>
          {rejectedWishlists.map((wishlist) => (
            <WishlistCard showActions={false} {...wishlist} />
          ))}
        </Section>
      </AnimateSharedLayout>
    </Content>
  );
}

const Header = styled(motion.h1)`
  font-size: 32px;
  font-weight: bold;
  font-family: "Fraunces";

  margin-top: 16px;
  margin-bottom: 32px;
`;

const Content = styled.div`
  flex: 1;
  padding: 64px;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"%3E%3Cpath fill="%239C92AC" fill-opacity="0.4" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"%3E%3C/path%3E%3C/svg%3E');

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Section = styled.section`
  flex: 1;
  padding: 32px;
  flex-direction: column;

  div {
    margin-top: 32px;
  }

  div:first-of-type {
    margin-top: 0px;
  }
`;
