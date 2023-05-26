import { CiSearch } from "react-icons/ci";
import { filterBySearch } from "../../utils/filterUtils";
import { useProductsContext } from "../../contexts";
import { useEffect, useState } from "react";
import CartItemCard from "../cart/CartItemCard";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { allProducts, applyFilters } = useProductsContext();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    if (location?.pathname !== "/product-listing") {
      setSearch("");
    }
  }, [location]);
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      setFilteredData(filterBySearch(search, allProducts));
      if (location?.pathname === "/product-listing" && !search) {
        applyFilters("searchText", search);
      }
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [search]);

  const changeHandler = (e) => {
    setSearch(e.target.value);
    if (!showList) setShowList(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    applyFilters("searchText", search);
    setShowList(false);
    navigate("/product-listing");
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`flex items-center bg-black/[0.075] px-3 ${
          search && showList ? "rounded-t-md" : "rounded-full"
        } text-sm transition`}
      >
        <input
          className="w-full py-2 px-3 bg-transparent focus:outline-none"
          type="search"
          value={search}
          placeholder="Search Glasses"
          onChange={changeHandler}
        />
        <CiSearch />
      </form>
      {search && showList && (
        <ul className="absolute bg-white w-full max-h-72 overflow-auto rounded-b-md z-10">
          {filteredData.length ? (
            filteredData.map((product) => (
              <li key={product._id} className="">
                <CartItemCard
                  product={product}
                  isSearch={true}
                  setSearch={setSearch}
                />
              </li>
            ))
          ) : (
            <li className="h-10 flex items-center justify-center">
              No Item to show
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default Search;
