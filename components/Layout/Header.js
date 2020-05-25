import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import FirebaseContext from "../../firebase/context";
//Components
import Searchbar from "../ui/Searchbar";
import Navbar from "./Navbar";
import Button from "../ui/Button";
const HeaderContainer = styled.div`
  max-width: 1200;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.a`
  color: var(--orange);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto slab";
  margin-right: 2rem;
  cursor: pointer;
`;
const Header = () => {
  const { user, firebase } = useContext(FirebaseContext);
  return (
    <header
      css={css`
        border-bottom: 2px solid #e1e1e1;
        padding: 1rem 0;
      `}
    >
      <HeaderContainer>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <Searchbar />
          <Navbar />
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {user ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
                `}
              >
                Hola: {user.displayName}{" "}
              </p>
              <Button bgColor="true" onClick={() => firebase.signOut()}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button bgColor="true">Login</Button>
              </Link>
              <Link href="/crear-cuenta">
                <Button>Crear cuenta</Button>
              </Link>
            </>
          )}
        </div>
      </HeaderContainer>
    </header>
  );
};

export default Header;
