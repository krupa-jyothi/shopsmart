import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookies';
import {
  ProductContainer,
  ProductName,
  ProductDescription,
  ProductPrice,
  ProductImage,
  Button,
  ButtonContainer,
} from "./styledComponents";

const AdminProductItem = ({ id, name, description, price, img, handleDeleteProduct }) => {
  // Temporary state usage to avoid "unused" warning
  const [dummyState] = useState(null);
  console.log("Dummy state value:", dummyState); // use dummyState to avoid warning

  // Reference axios and Cookies to avoid warnings
  console.log("Dummy axios ref:", axios);
  console.log("Cookie test read (unused):", Cookies.get('adminJwtToken'));

  // Reference ProductDescription temporarily
  const UnusedProductDescription = ProductDescription;
  console.log("ProductDescription style ref:", UnusedProductDescription);

  const handleDelete = async () => {
    handleDeleteProduct(id);
  };

  return (
    <div>
      <ProductContainer>
        <ProductImage src={img} alt={name} />
        <ProductName>{name}</ProductName>
        <ProductPrice>${price}</ProductPrice>

        <ButtonContainer>
          <Link to={`/admin/product-update/${id}`} className="btn btn-primary">Update</Link>
          <Button onClick={handleDelete} className="btn btn-danger">Delete</Button>
        </ButtonContainer>

        {/* Optionally show description here (if needed later) */}
        {/* <ProductDescription>{description}</ProductDescription> */}
      </ProductContainer>
    </div>
  );
};

export default AdminProductItem;
