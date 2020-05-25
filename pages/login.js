import React, { useState } from 'react';
import { css } from '@emotion/core';
import Layout from '../components/Layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';
import firebase from '../firebase';
import Router from 'next/router';

import useValidate from '../hooks/useValidate';
import validateLogin from '../utils/validateLogin';

const INITIAL_STATE = {
  email: '',
  password: ''
};


const Login = () => {
  const [error, setError] = useState(false);
  const {
    values,
    errors,
    handleSubmit,
    handleOnChange,
    handleOnBlur
  } = useValidate(INITIAL_STATE, validateLogin, login);
  const { email, password } = values;
  async function login() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al registrarse', error.message);
      setError(error.message);
    }
  }
  return (
    <Layout>
      <>
        <h1 css={css`
          text-align: center;
          margin-top: 5rem;
        `}>Iniciar Sesión</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >
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
          {errors.password && <Error>{errors.password}</Error>}
          {error && <Error>{error}</Error>}
          <InputSubmit 
            type="submit"
            value="Iniciar Sesión"
          />
        </Form>
      </>
    </Layout>
    )
}
 
export default Login;