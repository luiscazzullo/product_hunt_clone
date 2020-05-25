import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Router from "next/router";
const InputText = styled.input`
  border: 1px solid #e1e1e1;
  padding: 1rem;
  min-width: 300px;
`;
const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 2.5rem;
  background-image: url("/static/img/search.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 7px;
  background-color: white;
  border: none;
  text-indent: -9999px;
  &:hover {
    cursor: pointer;
  }
`;
const Searchbar = () => {
  const [query, setQuery] = useState("");
  const search = (ev) => {
    ev.preventDefault();
    if (query.trim() === "") return;
    Router.push({
      pathname: "/buscar",
      query: {
        q: query,
      },
    });
  };
  return (
    <form
      css={css`
        position: relative;
      `}
      onSubmit={search}
    >
      <InputText
        type="text"
        placeholder="Buscar productos"
        onChange={(ev) => setQuery(ev.target.value)}
      />
      <InputSubmit type="submit">Buscar</InputSubmit>
    </form>
  );
};

export default Searchbar;
