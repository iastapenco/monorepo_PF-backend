import { useState, useEffect } from "react";
import CardProducts from "../CardProducts/CardProducts";

const Products = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch("https://appcoffee-deploy1.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <>
      <div>
        <h2 className="center">Lista de productos</h2>
      </div>
      <div className="container row-gap-3 column-gap-3 d-flex flex-row justify-content-around align-content-around flex-wrap bg-primary mb-4">
        {products &&
          products.mensaje &&
          products.mensaje.docs &&
          products.mensaje.docs.map((product) => {
            return (
              <div key={product._id} className="product_container ">
                <div className="card">
                  <CardProducts data={product} />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Products;
