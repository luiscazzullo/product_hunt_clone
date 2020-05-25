import React, { useState, useContext } from "react";
import { css } from "@emotion/core";
import Layout from "../components/Layout/Layout";
import { Form, Field, InputSubmit, Error } from "../components/ui/Form";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";
import Error404 from "../components/Layout/404";
import useValidate from "../hooks/useValidate";
import validateNewProduct from "../utils/validateNewProduct";

const INITIAL_STATE = {
  name: "",
  company: "",
  //product_image: '',
  url: "",
  description: "",
};

const NewProduct = () => {
  const [error, setError] = useState(false);
  const [imageName, saveImageName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlImage, saveUrlImage] = useState("");
  const {
    values,
    errors,
    handleSubmit,
    handleOnChange,
    handleOnBlur,
  } = useValidate(INITIAL_STATE, validateNewProduct, createProduct);
  const { name, company, product_image, url, description } = values;
  const { user, firebase } = useContext(FirebaseContext);
  const router = useRouter();
  async function createProduct() {
    if (!user) {
      return router.push("/login");
    }
    const product = {
      name,
      company,
      url,
      urlImage,
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      owner: {
        id: user.uid,
        name: user.displayName,
      },
      hasVoted: [],
    };
    firebase.db.collection("products").add(product);
    router.push("/");
  }
  const handleUploadStart = () => {
    setProgress(0);
    setUploading(true);
  };
  const handleProgress = (progress) => setProgress({ progress });
  const handleUploadError = (error) => {
    setUploading(error);
    console.error(error);
  };
  const handleUploadSuccess = (name) => {
    setProgress(100);
    setUploading(false);
    saveImageName(name);
    firebase.storage
      .ref("products")
      .child(name)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        saveUrlImage(url);
      });
  };
  return (
    <Layout>
      {!user ? (
        <Error404 />
      ) : (
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Nuevo Producto
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Información General</legend>
              <Field>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nombre del producto"
                  name="name"
                  value={name}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {errors.name && <Error>{errors.name}</Error>}
              <Field>
                <label htmlFor="company">Empresa</label>
                <input
                  type="text"
                  id="company"
                  placeholder="Ingrese la empresa"
                  name="company"
                  value={company}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {errors.company && <Error>{errors.company}</Error>}
              <Field>
                <label htmlFor="product_image">Imagen</label>
                <FileUploader
                  id="product_image"
                  name="product_image"
                  accept="image/*"
                  randomizeFilename
                  storageRef={firebase.storage.ref("products")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </Field>
              <Field>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="URL de tu producto"
                  value={url}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {errors.url && <Error>{errors.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>Sobre tu producto</legend>
              <Field>
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  placeholder="Descripción"
                  name="description"
                  value={description}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {errors.description && <Error>{errors.description}</Error>}
            </fieldset>
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Producto" />
          </Form>
        </>
      )}
    </Layout>
  );
};

export default NewProduct;
