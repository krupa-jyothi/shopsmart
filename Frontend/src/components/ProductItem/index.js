import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookies'
import {
  ProductContainer,
  ProductName,
  ProductDescription,
  ProductPrice,
  ProductImage,
  Button,
  ButtonContainer,
} from "./styledComponents";

const ProductItem = ({ id, name, description, price, img }) => {
  const [quantity, setQuantity] = useState(1); // ✅ using useState

  const handleAddToCart = async () => {
    const userId = Cookies.getItem("userId");

    try {
      const response = await axios.post("http://localhost:5100/add-to-cart", {
        userId,
        productId: id,
        quantity: quantity, // include quantity
      });

      console.log("Cart add response:", response); // ✅ using response
      alert('Product Added to cart!');
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <ProductContainer>
      <ProductImage src={img} alt={name} />
      <ProductName>{name}</ProductName>
      <ProductDescription>{description}</ProductDescription> {/* ✅ use ProductDescription */}
      <ProductPrice>${price}</ProductPrice>
      
      <div style={{ margin: '10px 0' }}>
        <label>Quantity: </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '10px' }}
        />
      </div>

      <ButtonContainer>
        <Link to={`/order-details/${id}`} className="btn btn-primary" style={{ borderRadius: '0' }}>
          Buy Now
        </Link>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </ButtonContainer>
    </ProductContainer>
  );
};

export default ProductItem;
