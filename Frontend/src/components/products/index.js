import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductItem from '../ProductItem';
import Header from '../Header';

const ProductsContainer = styled.div`
  margin-top: 10vh; 
  padding: 20px;
  text-align: start;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  margin-top: 40px;
`;

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 20px;
  max-width: 270px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const CategoryFilter = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CarouselButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: transparent;
  cursor: pointer;

  &.carousel-control-prev {
    left: 0;
  }

  &.carousel-control-next {
    right: 0;
  }

  &:focus {
    outline: 2px solid #007bff;
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
  }

  .carousel-control-prev-icon {
    background-image: url("data:image/svg+xml,%3Csvg fill='black' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.5 0L4.09 1.41 6.67 4 4.09 6.59 5.5 8l4-4z'/%3E%3C/svg%3E");
  }

  .carousel-control-next-icon {
    background-image: url("data:image/svg+xml,%3Csvg fill='black' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 0L1.09 1.41 3.67 4 1.09 6.59 2.5 8l4-4z'/%3E%3C/svg%3E");
  }
`;

const Products = () => {
  const api = 'http://localhost:5100/products';
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch(api)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const productNameMatchesSearch =
      product.productname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.trim() === '';

    if (selectedCategory === 'all') {
      return productNameMatchesSearch;
    } else {
      return (
        productNameMatchesSearch &&
        product.category.toLowerCase() === selectedCategory
      );
    }
  });

  const categories = [
    ...new Set(products.map((product) => product.category.toLowerCase())),
  ];

  categories.unshift('all');

  return (
    <div>
      <Header />
      <ProductsContainer>
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-target="#carouselExampleIndicators"
              data-slide-to="0"
              className="active"
            ></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              {/* <img className="d-block w-100" src="..." alt="First slide" /> */}
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100"
                src="https://img.freepik.com/free-vector/beautiful-banner-floral-leaves-template_21799-2812.jpg?size=626&ext=jpg&ga=GA1.2.1493657015.1690885278&semt=ais"
                alt="Second slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100"
                src="https://img.freepik.com/free-psd/spring-sale-social-media-cover-template_47987-15231.jpg?size=626&ext=jpg&ga=GA1.2.1493657015.1690885278&semt=ais"
                alt="Third slide"
              />
            </div>
          </div>

          {/* Replace <a> with <button> to fix accessibility issue */}
          <CarouselButton
            className="carousel-control-prev"
            role="button"
            data-slide="prev"
            aria-label="Previous slide"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </CarouselButton>

          <CarouselButton
            className="carousel-control-next"
            role="button"
            data-slide="next"
            aria-label="Next slide"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </CarouselButton>
        </div>

        <FiltersContainer>
          <div className="w-100">
            <h3>Search By Product Name</h3>
            <SearchBar
              type="text"
              placeholder="Search by product name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-100">
            <h3>Filter By Category</h3>
            <CategoryFilter
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </CategoryFilter>
          </div>
        </FiltersContainer>

        <Heading>Products</Heading>
        <StyledList>
          {filteredProducts.map((product) => (
            <ListItem key={product._id}>
              <ProductItem
                id={product._id}
                img={product.image}
                name={product.productname}
                description={product.description}
                price={product.price}
              />
            </ListItem>
          ))}
        </StyledList>
      </ProductsContainer>
    </div>
  );
};

export default Products;
