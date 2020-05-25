import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import Error404 from "../../components/Layout/404";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Field, InputSubmit } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
const ProductOwner = styled.p`
  padding: 0.5rem 2rem;
  background: #da552f;
  color: #fff;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  display: inline-block;
`;
const ProductContainer = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const Product = () => {
  const { firebase, user } = useContext(FirebaseContext);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [comment, setComment] = useState({});
  const [queryDB, setQueryDB] = useState(true);
  const router = useRouter();
  const {
    query: { id },
  } = router;
  useEffect(() => {
    if (id && queryDB) {
      const getProduct = async () => {
        const productQuery = await firebase.db.collection("products").doc(id);
        const product = await productQuery.get();
        if (product.exists) {
          setProduct(product.data());
          setQueryDB(false);
        } else {
          setError(true);
          setQueryDB(false);
        }
      };
      getProduct();
    }
  }, [id]);
  if (Object.keys(product).length === 0 && !error) return "Cargando...";
  const {
    comments,
    created,
    description,
    company,
    name,
    url,
    urlImage,
    votes,
    owner,
    hasVoted,
  } = product;
  const isOwner = (id) => {
    if (owner.id === id) {
      return true;
    }
  };
  const addVotesToProduct = () => {
    if (!user) {
      return router.push("/");
    }
    const totalVotes = votes + 1;
    if (hasVoted.includes(user.uid)) return;
    const usersHasVoted = [...hasVoted, user.uid];
    firebase.db
      .collection("products")
      .doc(id)
      .update({ votes: totalVotes, hasVoted: usersHasVoted });
    setProduct({
      ...product,
      votes: totalVotes,
    });
    setQueryDB(true);
  };
  const handleCommentsOnChange = (ev) => {
    setComment({
      ...comment,
      [ev.target.name]: ev.target.value,
    });
  };
  const AddComments = (ev) => {
    ev.preventDefault();
    if (!user) {
      return router.push("/login");
    }
    comment.userId = user.uid;
    comment.userName = user.displayName;
    const newComments = [...comments, comment];
    firebase.db
      .collection("products")
      .doc(id)
      .update({ comments: newComments });
    setProduct({
      ...product,
      comments: newComments,
    });
    setQueryDB(true);
  };
  const isAuth = () => {
    if (!user) return false;
    if (user.uid === owner.id) {
      return true;
    }
  };
  const deleteProduct = async () => {
    if (!user) {
      return router.push("/login");
    }
    if (user.uid !== owner.id) {
      return router.push("/");
    }
    try {
      firebase.db.collection("products").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log("Hubo un error", error);
    }
  };
  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {name}
            </h1>
            <ProductContainer>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(created), { locale: es })}
                </p>
                <p>
                  Publicado por: {owner.name} de: {company}
                </p>
                <img src={urlImage} />
                <p>{description}</p>
                {user && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={AddComments}>
                      <Field>
                        <input
                          onChange={handleCommentsOnChange}
                          type="text"
                          name="message"
                        />
                      </Field>
                      <InputSubmit type="submit" value="Agregar comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comments.length === 0 ? (
                  "Aún no hay comentarios"
                ) : (
                  <ul>
                    {comments.map((comment, i) => (
                      <li
                        key={`${comment.userId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comment.message}</p>
                        <p>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comment.userName}
                          </span>
                        </p>
                        {isOwner(comment.userId) && (
                          <ProductOwner>Es creador</ProductOwner>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Button target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Button>
                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votes} votos
                  </p>
                  {user && <Button onClick={addVotesToProduct}>Votar</Button>}
                </div>
              </aside>
            </ProductContainer>
            {isAuth() && <Button onClick={deleteProduct}>Eliminar</Button>}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Product;
