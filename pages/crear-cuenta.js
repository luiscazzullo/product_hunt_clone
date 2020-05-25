import React, { useState } from 'react';
import { css } from '@emotion/core';
import Layout from '../components/Layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';
import firebase from '../firebase';
import Router from 'next/router';

import useValidate from '../hooks/useValidate';
import validateNewAccount from '../utils/validateNewAccount';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: ''
};

const CreateAccount = () => {
  const [error, setError] = useState(false);
  const {
    values,
    errors,
    handleSubmit,
    handleOnChange,
    handleOnBlur
  } = useValidate(INITIAL_STATE, validateNewAccount, createUser);
  const { name, email, password } = values;
  async function createUser() {
    try {
      await firebase.register(name, email, password);
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error', error.message)
      setError(error.message);
    }
  }
    return (
        <Layout>
          <>
            <h1 css={css`
              text-align: center;
              margin-top: 5rem;
            `}>Crear cuenta</h1>
            <Form
              onSubmit={handleSubmit}
              noValidate
            >
              <Field>
                <label htmlFor="name">Nombre</label>
                <input 
                  type="text"
                  id="name"
                  placeholder="Tu nombre"
                  name="name"
                  value={name}
                  onChange={handleOnChange}
                />
              </Field>
              {errors.name && <Error>{errors.name}</Error>}
              <Field>
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  placeholder="Tu email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {errors.email && <Error>{errors.email}</Error>}
              <Field>
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  placeholder="Tu Password"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                />
              </Field>
              {error && <Error>{error}</Error>}
              <InputSubmit 
                type="submit"
                value="Crear Cuenta"
              />
            </Form>
          </>
        </Layout>
      )
}
 
export default CreateAccount;
