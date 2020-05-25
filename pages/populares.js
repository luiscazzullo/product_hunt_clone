import React from "react";
import Layout from "../components/Layout/Layout";
import Products from "../components/Layout/Products";
import useProducts from "../hooks/useProducts";

const Populars = () => {
  const { products } = useProducts("votes");
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {products.map((product) => (
                <Products key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Populars;
