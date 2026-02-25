import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (!searchQuery) setIsSearchOpen(false);
      else handleSearchSubmit();
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="/"
            className="flex items-center gap-1"
          >
            <img
              src="/images/logo.png"
              alt="Donum Logo"
              className="h-7 w-auto object-contain"
            />

            <span className="hidden tracking-widest pb-0.5 sm:inline text-[24px] font-poppins font-bold tracking-wide text-[#760815]">
              ONUM
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            <li>
              <Link
                to="/shop"
                className="text-[18px] font-poppins font-semibold text-zinc-700 hover:text-[#760815] transition"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                className="text-[18px] font-poppins font-semibold text-zinc-700 hover:text-[#760815] transition"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/#about"
                className="text-[18px] font-poppins font-semibold text-zinc-700 hover:text-[#760815] transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="text-[18px] font-poppins font-semibold text-zinc-700 hover:text-[#760815] transition"
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-6">
            <div
              className={`flex items-center transition-all duration-300 ease-in-out border rounded-full
                ${
                  isSearchOpen
                    ? "border-zinc-300 pl-3 pr-2 py-1 bg-gray-50"
                    : "border-transparent p-0 bg-transparent"
                }`}
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none text-sm text-zinc-700 placeholder-zinc-400 transition-all duration-300
                        ${
                          isSearchOpen
                            ? "w-37.5 md:w-50 opacity-100 mr-2"
                            : "w-0 opacity-0 p-0"
                        }`}
                />
              </form>

              <button
                onClick={handleSearchToggle}
                className="text-zinc-700 cursor-pointer hover:text-zinc-900"
              >
                <Search size={20} />
              </button>
            </div>

            <Link
              to="/cart"
              className="relative text-zinc-700 hover:text-zinc-900 transition"
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 text-[10px] bg-black text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-zinc-700 hover:text-zinc-900 transition"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <ul className="flex flex-col gap-4 px-6 py-4">
            <li>
              <Link to="/shop" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/collections" onClick={() => setIsOpen(false)}>
                Collections
              </Link>
            </li>
            <li>
              <Link to="/#about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/#contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
