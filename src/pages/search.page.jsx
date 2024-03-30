import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useCategoriesQuery, useSearchProductsQuery } from "../../redux/api/productAPI.js";
import { addToCart } from "../../redux/reducer/cart.reducer.js";
import ProductCard from "../components/productCard.component.jsx";
const Search = () => {
  
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError, 
    error, 
  } = useCategoriesQuery("");


  

  if (isError) toast.error("cannot fetch the product categories");

  

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);


  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  if (productIsError) toast.error("cannot fetch the product by Filters");
  
  console.log(searchedData?.data?.totalPage)

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

   
  const dispatch = useDispatch();

  const addToCartHandler = (product) => {
    if (product.stock < 1) {
      toast.error("Out of Stock");
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity: 1,
      price: Number(product.price),
      name: product.name,
      photo: product.photo,
      stock: Number(product.stock),
    };


    dispatch(addToCart(cartItem));
    toast.success("Product Added to Cart");
  };

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={handleCategoryChange}>
            <option value="">ALL</option>
            {/* Categories options can be added here dynamically */}
            {!loadingCategories &&
              categoriesResponse?.data.map((category) => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
        {/* Additional JSX for displaying search results and pagination controls can be added here */}

        
          <div className="search-product-list">
            {searchedData?.data?.products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={()=>addToCartHandler(product)}
                photo={product.photo}
              />
            ))}

       {searchedData && searchedData?.data?.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData?.data?.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
          )}
          </div>
      </main>
    </div>
  );
};

export default Search;
