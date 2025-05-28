import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../App.css';
import cartImage from '../assets/images/cart.png';

// Fallback image for testing
const FALLBACK_IMAGE = 'https://via.placeholder.com/60x60.png?text=Logo';

// Navigation Bar Component
const Navbar = ({ toggleCart, totalCartItems }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Medica</Link>
        {user && (
          <span className="user-greeting" aria-label={`Welcome ${user.name || user.email.split('@')[0]}`}>
            Hello,&nbsp;
            <span className="user-name">{user.name || user.email.split('@')[0]}</span>!
          </span>
        )}
      </div>
    
      <ul className="nav-links">
        {['Home', 'Pharma', 'MedicAIl', 'Appointments', 'Blog Resources', 'About Us', 'Contact Us'].map((link, idx) => (
          <li key={idx}>
            <Link to={`/${link.toLowerCase().replace(/\s/g, '-')}`}>{link}</Link>
          </li>
        ))}
        <li>
          <div className="cart-icon" onClick={toggleCart}>
            <img src={cartImage} alt="Cart" className="cart-image" />
            {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
          </div>
        </li>
        <li>
          {user ? (
            <button onClick={handleLogout} className="login-btn">Logout</button>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

// Sub-Navbar Component
const SubNavbar = ({ toggleCart, totalCartItems, toggleFilter, showFilter, companies, handleSortChange, priceRange, handlePriceRangeChange, filterCompany, handleCompanyFilterChange, clearFilters }) => (
  <nav className="sub-navbar">
    <div className="sub-nav-content">
      <Link to="/your-orders" className="sub-nav-link">Your Orders</Link>
      <div className="cart-icon" onClick={toggleCart}>
        <img src={cartImage} alt="Cart" className="cart-image" />
        {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
      </div>
      <div className="filter-container">
        <button className="filter-btn" onClick={toggleFilter}>Filter</button>
        {showFilter && (
          <div className="filter-dropdown">
            <div className="filter-section">
              <h4>Sort by Price</h4>
              <button onClick={() => handleSortChange('highToLow')}>Highest to Lowest</button>
              <button onClick={() => handleSortChange('lowToHigh')}>Lowest to Highest</button>
            </div>
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range-inputs">
                <input type="number" name="min" placeholder="Min" value={priceRange.min} onChange={handlePriceRangeChange} />
                <input type="number" name="max" placeholder="Max" value={priceRange.max} onChange={handlePriceRangeChange} />
              </div>
            </div>
            <div className="filter-section">
              <h4>Filter by Company</h4>
              <select value={filterCompany} onChange={handleCompanyFilterChange}>
                <option value="">All Companies</option>
                {companies.map((company, idx) => (
                  <option key={idx} value={company.name}>{company.name}</option>
                ))}
              </select>
            </div>
            <button className="clear-filter-btn" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

// Cart Component
const Cart = ({ showCart, cart, toggleCart, handleRemoveFromCart, totalPrice }) => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, totalPrice } });
  };
  return (
    showCart && (
      <section className="cart-section">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={item.medicine?._id || item._id}>
                  <img src={item.medicine?.image || FALLBACK_IMAGE} alt={item.medicine?.brandName || 'Unknown'} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.medicine?.brandName || 'Unknown Medicine'}</h3>
                    <p><strong>Company:</strong> {item.medicine?.company || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹{item.effectivePrice?.toFixed(2) || '0.00'}</p>
                    <p><strong>Quantity:</strong> {item.quantity || 1}</p>
                    <p><strong>Total:</strong> ₹{((item.effectivePrice || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    <button className="btn remove-btn" onClick={() => handleRemoveFromCart(item.medicine?._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Total: ₹{totalPrice}</h3>
              <button className="btn checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
        <button className="btn close-cart-btn" onClick={toggleCart}>Close Cart</button>
      </section>
    )
  );
};

// Medicine Card Component
const MedicineCard = ({ medicine, handleMedicineClick }) => {
  const isDiscounted = hasDiscount(medicine._id);
  const displayPrice = isDiscounted ? calculateDiscountedPrice(medicine.price) : medicine.price;
  return (
    <div className="medicine-card" onClick={() => handleMedicineClick(medicine)}>
      {isDiscounted && <span className="discount-label">18% OFF</span>}
      <img src={medicine.image} alt={`${medicine.brandName} by ${medicine.company}`} className="medicine-image" />
      <h3>{medicine.brandName}</h3>
      <p><strong>Formula:</strong> {medicine.formula}</p>
      <p><strong>Company:</strong> {medicine.company}</p>
      <p className="medicine-price">
        {isDiscounted ? (
          <>
            <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>
              ₹{medicine.price.toFixed(2)}
            </span>
            ₹{displayPrice.toFixed(2)}
          </>
        ) : (
          `₹${medicine.price.toFixed(2)}`
        )}
      </p>
      <button className="btn">Add to Cart</button>
    </div>
  );
};

// Medicine Row Component
const MedicineRow = ({ medicines, rowRef, scrollRowLeft, scrollRowRight, handleMedicineClick }) => (
  <div className="medicine-row-container">
    <div className="medicine-row" ref={rowRef}>
      {medicines.map((medicine, idx) => (
        <MedicineCard key={idx} medicine={medicine} handleMedicineClick={handleMedicineClick} />
      ))}
    </div>
    {medicines.length > 0 && (
      <>
        <button className="scroll-btn scroll-left" onClick={() => scrollRowLeft(rowRef)}>&lt;</button>
        <button className="scroll-btn scroll-right" onClick={() => scrollRowRight(rowRef)}>&gt;</button>
      </>
    )}
  </div>
);

// Product Detail Modal Component
const ProductModal = ({ selectedMedicine, handleCloseModal, quantity, handleQuantityChange, handleBuyNow, handleAddToCart }) => {
  if (!selectedMedicine) return null;
  const isDiscounted = hasDiscount(selectedMedicine._id);
  const displayPrice = isDiscounted ? calculateDiscountedPrice(selectedMedicine.price) : selectedMedicine.price;

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
        <div className="modal-body">
          <div className="modal-image-container">
            <img src={selectedMedicine.image} alt={`${selectedMedicine.brandName} by ${selectedMedicine.company}`} className="modal-image" />
          </div>
          <div className="modal-details">
            <h2>{selectedMedicine.brandName}</h2>
            <p><strong>Company:</strong> {selectedMedicine.company}</p>
            <p><strong>Formula:</strong> {selectedMedicine.formula}</p>
            <p><strong>Price:</strong>
              {isDiscounted ? (
                <>
                  <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>
                    ₹{selectedMedicine.price.toFixed(2)}
                  </span>
                  ₹{displayPrice.toFixed(2)}
                </>
              ) : (
                ` ₹${selectedMedicine.price.toFixed(2)}`
              )}
            </p>
            <p><strong>Description:</strong> {selectedMedicine.description || 'No description available.'}</p>
            <p><strong>Dosage:</strong> {selectedMedicine.dosage || 'As prescribed by a doctor.'}</p>
            <div className="quantity-selector">
              <label><strong>Quantity:</strong></label>
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <div className="modal-actions">
              <button className="btn buy-now-btn" onClick={() => handleBuyNow(selectedMedicine, quantity, displayPrice)}>Buy Now</button>
              <button className="btn add-to-cart-btn" onClick={() => handleAddToCart(selectedMedicine, quantity, displayPrice)}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <p>© 2025 Medica. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/about-us">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact-us">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>Connect with us:</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/pragnesh.reddy.96" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/praxx.9/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com/in/pragnesh-reddy-g-014242255/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>
  </footer>
);

// Utility Functions
const formatPrice = (price) => (typeof price === 'number' ? price : 0).toFixed(2);

const hasDiscount = (medicineId) => {
  const discountedIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];
  return discountedIds.includes(medicineId?.toString());
};

const calculateDiscountedPrice = (price) => {
  const discount = 0.18;
  return price * (1 - discount);
};

// Main Pharma Component
const Pharma = () => {
  const { user, setUser } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [filterCompany, setFilterCompany] = useState('');
  const navigate = useNavigate();

  const companyListRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  // Check session validity
  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check-auth', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
        return false;
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
      return false;
    }
  };

  // Fetch Medicines from Backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medicines', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataIntegral = await response.json();
        console.log('Fetched medicines:', dataIntegral);
        const updatedMedicines = dataIntegral.map(medicine => ({
          ...medicine,
          image: medicine.image ? `http://localhost:5000${medicine.image}` : FALLBACK_IMAGE,
          companyImage: medicine.companyImage ? `http://localhost:5000${medicine.companyImage}` : null,
        }));
        setMedicines(updatedMedicines);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Fetch Cart from Backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error(`Failed to fetch cart: HTTP ${response.status}`);
          if (response.status === 401) {
            await checkSession();
          }
          return;
        }
        const data = await response.json();
        const updatedCart = (data.items || []).map(item => {
          if (!item.medicine) {
            console.warn('Cart item missing medicine:', item);
            return {
              ...item,
              medicine: {
                image: FALLBACK_IMAGE,
                companyImage: null,
                brandName: 'Unknown',
                company: 'N/A',
                _id: item._id || 'unknown',
              },
            };
          }
          return {
            ...item,
            medicine: {
              ...item.medicine,
              image: typeof item.medicine.image === 'string' && item.medicine.image ?
                (item.medicine.image.startsWith('http') ? item.medicine.image : `http://localhost:5000${item.medicine.image}`) :
                FALLBACK_IMAGE,
              companyImage: typeof item.medicine.companyImage === 'string' && item.medicine.companyImage ?
                (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `http://localhost:5000${item.medicine.companyImage}`) :
                null,
            },
          };
        });
        setCart(updatedCart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  const companies = [...new Map(medicines.map(medicine => [medicine.company, { name: medicine.company, image: medicine.companyImage }])).values()].sort((a, b) => a.name.localeCompare(b.name));

  const filteredMedicines = selectedCompany
    ? medicines.filter(medicine => medicine.company === selectedCompany)
    : medicines;

  const searchedMedicines = filteredMedicines.filter(medicine => {
    const query = searchQuery.toLowerCase();
    return (
      medicine.brandName.toLowerCase().includes(query) ||
      medicine.formula.toLowerCase().includes(query) ||
      medicine.company.toLowerCase().includes(query)
    );
  });

  let displayedMedicines = [...searchedMedicines];
  if (filterCompany) {
    displayedMedicines = displayedMedicines.filter(medicine => medicine.company === filterCompany);
  }
  if (priceRange.min !== '' && priceRange.max !== '') {
    displayedMedicines = displayedMedicines.filter(medicine => {
      const price = hasDiscount(medicine._id) ? calculateDiscountedPrice(medicine.price) : medicine.price;
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || Infinity;
      return price >= min && price <= max;
    });
  }
  if (sortType === 'highToLow') {
    displayedMedicines.sort((a, b) => {
      const priceA = hasDiscount(a._id) ? calculateDiscountedPrice(a.price) : a.price;
      const priceB = hasDiscount(b._id) ? calculateDiscountedPrice(b.price) : b.price;
      return priceB - priceA;
    });
  } else if (sortType === 'lowToHigh') {
    displayedMedicines.sort((a, b) => {
      const priceA = hasDiscount(a._id) ? calculateDiscountedPrice(a.price) : a.price;
      const priceB = hasDiscount(b._id) ? calculateDiscountedPrice(b.price) : b.price;
      return priceA - priceB;
    });
  }

  const isFilteredOrSearched = searchQuery !== '' || filterCompany !== '' || priceRange.min !== '' || priceRange.max !== '' || sortType !== '';
  const previewMedicines = isFilteredOrSearched ? displayedMedicines : displayedMedicines.slice(0, 24);
  const row1Preview = previewMedicines.slice(0, 8);
  const row2Preview = previewMedicines.slice(8, 16);
  const row3Preview = previewMedicines.slice(16, 24);

  const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = formatPrice(cart.reduce((total, item) => total + (item.effectivePrice || 0) * (item.quantity || 0), 0));

  const scrollLeft = () => companyListRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => companyListRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  const scrollRowLeft = (rowRef) => rowRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRowRight = (rowRef) => rowRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setShowAll(false); };
  const handleMedicineClick = (medicine) => { setSelectedMedicine(medicine); setQuantity(1); };
  const handleCloseModal = () => setSelectedMedicine(null);
  const handleQuantityChange = (change) => setQuantity(prev => Math.max(1, prev + change));

  const handleAddToCart = async (medicine, qty, price) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    const isSessionValid = await checkSession();
    if (!isSessionValid) return;

    try {
      const payload = { medicineId: medicine._id, quantity: qty, effectivePrice: price };
      console.log('Adding to cart:', payload);
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const responseBody = await response.text();
      console.log('Cart add response:', { status: response.status, body: responseBody });

      if (!response.ok) {
        let errorMessage = 'Failed to add item to cart.';
        if (response.status === 401) {
          // Retry after session refresh
          const retrySessionValid = await checkSession();
          if (retrySessionValid) {
            const retryResponse = await fetch('http://localhost:5000/api/cart/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              credentials: 'include',
            });
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              if (!retryData.items) {
                throw new Error('Invalid response: No items found in cart data');
              }
              const updatedCart = retryData.items.map(item => ({
                ...item,
                medicine: item.medicine ? {
                  ...item.medicine,
                  image: item.medicine.image?.startsWith('http') ? item.medicine.image : `http://localhost:5000${item.medicine.image || ''}` || FALLBACK_IMAGE,
                  companyImage: item.medicine.companyImage?.startsWith('http') ? item.medicine.companyImage : `http://localhost:5000${item.medicine.companyImage || ''}` || null,
                } : {
                  image: FALLBACK_IMAGE,
                  companyImage: null,
                  brandName: 'Unknown',
                  company: 'N/A',
                  _id: item._id || 'unknown',
                },
              }));
              setCart(updatedCart);
              handleCloseModal();
              alert('Item added to cart successfully!');
              return;
            }
          }
          errorMessage = 'Session expired. Please log in again.';
          navigate('/login');
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please check the medicine details.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        throw new Error(`${errorMessage} (Status: ${response.status}, Body: ${responseBody})`);
      }

      const data = JSON.parse(responseBody);
      if (!data.items) {
        throw new Error('Invalid response: No items found in cart data');
      }

      const updatedCart = data.items.map(item => {
        if (!item.medicine) {
          console.warn('Cart item missing medicine after add:', item);
          return {
            ...item,
            medicine: {
              image: FALLBACK_IMAGE,
              companyImage: null,
              brandName: 'Unknown',
              company: 'N/A',
              _id: item._id || 'unknown',
            },
          };
        }
        return {
          ...item,
          medicine: {
            ...item.medicine,
            image: typeof item.medicine.image === 'string' && item.medicine.image ?
              (item.medicine.image.startsWith('http') ? item.medicine.image : `http://localhost:5000${item.medicine.image}`) :
              FALLBACK_IMAGE,
            companyImage: typeof item.medicine.companyImage === 'string' && item.medicine.companyImage ?
              (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `http://localhost:5000${item.medicine.companyImage}`) :
              null,
          },
        };
      });
      setCart(updatedCart);
      handleCloseModal();
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add item to cart. Please try again.');
    }
  };

  const handleRemoveFromCart = async (medicineId) => {
    if (!medicineId) {
      console.warn('Cannot remove item: medicineId is undefined');
      return;
    }
    const isSessionValid = await checkSession();
    if (!isSessionValid) return;

    try {
      console.log('Removing from cart:', { medicineId });
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineId }),
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          await checkSession();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const updatedCart = (data.items || []).map(item => {
        if (!item.medicine) {
          console.warn('Cart item missing medicine after remove:', item);
          return {
            ...item,
            medicine: {
              image: FALLBACK_IMAGE,
              companyImage: null,
              brandName: 'Unknown',
              company: 'N/A',
              _id: item._id || 'unknown',
            },
          };
        }
        return {
          ...item,
          medicine: {
            ...item.medicine,
            image: typeof item.medicine.image === 'string' && item.medicine.image ?
              (item.medicine.image.startsWith('http') ? item.medicine.image : `http://localhost:5000${item.medicine.image}`) :
              FALLBACK_IMAGE,
            companyImage: typeof item.medicine.companyImage === 'string' && item.medicine.companyImage ?
              (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `http://localhost:5000${item.medicine.companyImage}`) :
              null,
          },
        };
      });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const handleBuyNow = async (medicine, qty, price) => {
    if (!user) {
      alert('Please log in to proceed with Buy Now.');
      navigate('/login');
      return;
    }

    const isSessionValid = await checkSession();
    if (!isSessionValid) return;

    try {
      await handleAddToCart(medicine, qty, price);
      navigate('/checkout', { state: { cart: [{ medicine, quantity: qty, effectivePrice: price }], totalPrice: formatPrice(qty * price) } });
    } catch (error) {
      console.error('Error during buy now:', error);
      alert('Failed to process Buy Now. Please try again.');
    }
  };

  const toggleCart = () => { setShowCart(!showCart); setShowFilter(false); };
  const toggleFilter = () => { setShowFilter(!showFilter); setShowCart(false); };
  const handleSortChange = (type) => { setSortType(type); setShowFilter(false); };
  const handlePriceRangeChange = (e) => setPriceRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCompanyFilterChange = (e) => setFilterCompany(e.target.value);
  const clearFilters = () => { setSortType(''); setPriceRange({ min: '', max: '' }); setFilterCompany(''); setShowFilter(false); };

  return (
    <div>
      <style>
        {`
        .company-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          margin: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }
        .company-card:hover {
          transform: scale(1.05);
          border-color: #007bff;
        }
        .company-card.selected {
          border-color: #007bff;
          background-color: #f0f8ff;
        }
        .company-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 5px;
        }
        .company-image-placeholder {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 50%;
          font-size: 24px;
          font-weight: bold;
          color: #666;
          margin-bottom: 5px;
        }
        .comp-text {
          font-size: 14px;
          text-align: center;
          margin: 0;
          color: #333;
        }
        `}
      </style>
      <Navbar toggleCart={toggleCart} totalCartItems={totalCartItems} />
      <section className="pharma-header">
        <h1>Pharmacy Services</h1>
        <p>Welcome to our online pharmacy, where convenience meets health...</p>
        <button>Shop Now</button>
      </section>
      <section className="browse-medicines">
        <h2>Browse Medicines</h2>
        <div className="search-container">
          <input type="text" placeholder="Search for medicines" className="search-input" value={searchQuery} onChange={handleSearchChange} />
        </div>
      </section>
      <SubNavbar
        toggleCart={toggleCart}
        totalCartItems={totalCartItems}
        toggleFilter={toggleFilter}
        showFilter={showFilter}
        companies={companies}
        handleSortChange={handleSortChange}
        priceRange={priceRange}
        handlePriceRangeChange={handlePriceRangeChange}
        filterCompany={filterCompany}
        handleCompanyFilterChange={handleCompanyFilterChange}
        clearFilters={clearFilters}
      />
      <Cart
        showCart={showCart}
        cart={cart}
        toggleCart={toggleCart}
        handleRemoveFromCart={handleRemoveFromCart}
        totalPrice={totalPrice}
      />
      <section className="company-medicine-section">
        {!isFilteredOrSearched && (
          <>
            <h2>Featured Brands</h2>
            <div className="company-list-container">
              <div className="company-list" ref={companyListRef}>
                {companies.map((company, idx) => {
                  const imageSrc = company.image || FALLBACK_IMAGE;
                  return (
                    <div
                      key={idx}
                      className={`company-card ${selectedCompany === company.name ? 'selected' : ''}`}
                      onClick={() => { setSelectedCompany(company.name); setShowAll(false); }}
                    >
                      <img
                        src={imageSrc}
                        alt={`${company.name} logo`}
                        className="company-image"
                        onError={(e) => {
                          console.error(`Failed to load image for ${company.name}: ${imageSrc}`);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                          e.target.nextSibling.style.display = 'none';
                        }}
                      />
                      <div
                        className="company-image-placeholder"
                        style={{ display: imageSrc === FALLBACK_IMAGE ? 'flex' : 'none' }}
                      >
                        {company.name.charAt(0)}
                      </div>
                      <h3 className="comp-text">{company.name}</h3>
                    </div>
                  );
                })}
              </div>
              <div>
                <button className="scroll-cmppbtn scroll-left" onClick={scrollLeft}>&lt;</button>
                <button className="scroll-cmppbtn scroll-right" onClick={scrollRight}>&gt;</button>
              </div>
            </div>
          </>
        )}
        <div className="medicine-catalog">
          {selectedCompany && !isFilteredOrSearched ? (
            <>
              <h2>{selectedCompany} Medicines</h2>
              {displayedMedicines.length > 0 ? (
                <div className="medicine-cards">
                  {displayedMedicines.map((medicine, idx) => (
                    <MedicineCard key={idx} medicine={medicine} handleMedicineClick={handleMedicineClick} />
                  ))}
                </div>
              ) : (
                <p>No medicines found matching your criteria.</p>
              )}
            </>
          ) : (
            <>
              <h2>Medicine Catalog</h2>
              {displayedMedicines.length > 0 ? (
                isFilteredOrSearched || showAll ? (
                  <div className="medicine-cards">
                    {displayedMedicines.map((medicine, idx) => (
                      <MedicineCard key={idx} medicine={medicine} handleMedicineClick={handleMedicineClick} />
                    ))}
                  </div>
                ) : (
                  <>
                    <MedicineRow medicines={row1Preview} rowRef={row1Ref} scrollRowLeft={scrollRowLeft} scrollRowRight={scrollRowRight} handleMedicineClick={handleMedicineClick} />
                    <MedicineRow medicines={row2Preview} rowRef={row2Ref} scrollRowLeft={scrollRowLeft} scrollRowRight={scrollRowRight} handleMedicineClick={handleMedicineClick} />
                    <MedicineRow medicines={row3Preview} rowRef={row3Ref} scrollRowLeft={scrollRowLeft} scrollRowRight={scrollRowRight} handleMedicineClick={handleMedicineClick} />
                    {medicines.length > 24 && !isFilteredOrSearched && (
                      <button className="show-all-btn" onClick={() => setShowAll(true)}>Show All</button>
                    )}
                  </>
                )
              ) : (
                <p>No medicines found matching your criteria.</p>
              )}
            </>
          )}
        </div>
      </section>
      <ProductModal
        selectedMedicine={selectedMedicine}
        handleCloseModal={handleCloseModal}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleBuyNow={handleBuyNow}
        handleAddToCart={handleAddToCart}
      />
      <Footer />
    </div>
  );
};

export default Pharma;