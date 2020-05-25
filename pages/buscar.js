import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";
import useProducts from "../hooks/useProducts";
import Products from "../components/Layout/Products";

const Populars = () => {
  const router = useRouter();
  const { products } = useProducts("created");
  const {
    query: { q },
  } = router;
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (!q) return;
    const search = q.toLowerCase();
    const filterProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      );
    });
    setResults(filterProducts);
  }, [q, products]);
  return (
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {results.map((result) => (
              <Products key={result.id} product={result} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Populars;
