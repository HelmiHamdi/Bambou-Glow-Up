// Header.jsx
import React, { useState } from "react";
import {   Link, useLocation } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 👉 Header fixed uniquement sur la page d'accueil
  const isHome = location.pathname === "/";

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Accueil" },
    {label: "Particien", href: "#praticiens" },
    { label: "Avant / Après", href: "#beforeafter" },
    { label: "Contact", href: "#contact" },
     {label:"Processus ",href:"#how-it-works"}
  ];

  return (
    <header className={`${isHome ? "fixed" : "static"} top-0 left-0 w-full z-50 bg-[#F7EFE6]  relative`}>
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 ">
            <img
              src={logo}
              alt="Bambou Logo"
              className="h-8 md:h-10 object-contain"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 ml-auto">
            {navItems.map((item, i) =>
              item.path ? (
                <Link
                  key={i}
                  to={item.path}
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-[#0F5B4F] border-b-2 border-[#0F5B4F]"
                      : "text-gray-700 hover:text-[#0F5B4F]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={i}
                  href={item.href}
                  className="font-medium text-gray-700 hover:text-[#0F5B4F] transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          {/* Espace pour équilibrer */}
          <div className="hidden md:block w-10"></div>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F7EFE6] shadow-lg z-50">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item, i) =>
                item.path ? (
                  <Link
                    key={i}
                    to={item.path}
                    className="font-medium text-gray-700 hover:text-[#0F5B4F] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={item.href}
                    className="font-medium text-gray-700 hover:text-[#0F5B4F] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;