import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { decrement, increment, removeItem } from './store/cartSlice'
import './App.css'

const formatPrice = (value) =>
  `${new Intl.NumberFormat('uz-UZ').format(value)} so'm`

function Header({ count, onMenuToggle, search, onSearchChange }) {
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/products?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" type="button" aria-label="Menyu" onClick={onMenuToggle}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <Link className="brand" to="/" aria-label="Bosh sahifa">
          <span className="brand-mark">U</span>
          <span>uzum market</span>
        </Link>
      </div>
      <button className="catalog-button" type="button">
        <span>▦</span> Katalog
      </button>
      <form className="search-box" onSubmit={submitSearch}>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Mahsulot va turkumlar izlash"
        />
      </form>
      <nav className="header-nav" aria-label="Asosiy">
        <Link to="/">Bosh sahifa</Link>
        <Link to="/products">Mahsulotlar</Link>
        <Link className="cart-link" to="/cart">
          Savat <span className="cart-count">{count}</span>
        </Link>
      </nav>
    </header>
  )
}

const categories = [
  ['smartphone', 'Telefonlar', 'Elektronika'],
  ['appliances', 'Maishiy texnika', 'Maishiy texnika'],
  ['clothing', 'Kiyim', 'Kiyim'],
  ['shoe', 'Poyabzal', 'Poyabzal'],
  ['beauty', 'Go‘zallik', 'Go‘zallik'],
  ['toy', 'Bolalar uchun', 'Bolalar uchun'],
  ['pc', 'Kompyuter texnikasi', 'Noutbuklar'],
  ['sport', 'Sport', 'Sport'],
]

function Sidebar({ open = true }) {
  return (
    <aside className={`sidebar${open ? '' : ' sidebar-hidden'}`}>
      <h2>Turkumlar</h2>
      {categories.map(([icon, name, filter]) => (
        <Link
          className="category-link"
          to={`/products?category=${encodeURIComponent(filter)}`}
          key={name}
        >
          <span className={`category-icon category-${icon}`}>
            {icon === 'smartphone' ? '📱' : icon === 'appliances' ? '🏠' : icon === 'clothing' ? '👕' : icon === 'shoe' ? '👟' : icon === 'beauty' ? '✨' : icon === 'toy' ? '🧸' : icon === 'pc' ? '💻' : '⚽'}
          </span>
          <span>{name}</span>
        </Link>
      ))}
    </aside>
  )
}

function Home({ items, menuOpen }) {
  return (
    <main className="market-layout">
      <Sidebar open={menuOpen} />
      <div className="market-content">
        <section className="promo-banner">
          <div>
            <p>Uzum Marketda</p>
            <h1>Katta chegirmalar!</h1>
            <Link to="/products">Hozir xarid qilish →</Link>
          </div>
          <span className="promo-gift">🎁</span>
        </section>
        <div className="section-title">
          <h2>Ommabop mahsulotlar</h2>
          <Link to="/products">Hammasini ko'rish</Link>
        </div>
        <div className="product-grid home-grid">
          {items.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </main>
  )
}

function ProductCard({ item }) {
  const dispatch = useDispatch()

  return (
    <article className="product-card">
      <button className="favorite" type="button" aria-label="Sevimlilarga qo'shish">♡</button>
      <div className="product-image" style={{ background: item.color }}>
        <span>{item.emoji}</span>
      </div>
      <p className="category">{item.category}</p>
      <h2>{item.name}</h2>
      <div className="product-prices">
        <strong>{formatPrice(item.price)}</strong>
        <del>{formatPrice(item.oldPrice)}</del>
      </div>
      <button className="add-button" type="button" onClick={() => dispatch(increment(item.id))}>
        <span>🛒</span> Savatga
      </button>
    </article>
  )
}

function Products({ items, menuOpen }) {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()
  const category = searchParams.get('category') ?? ''
  const filteredItems = items.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    const matchesCategory =
      !category ||
      item.category.toLowerCase() === category.toLowerCase()
    return matchesQuery && matchesCategory
  })

  return (
    <main className="market-layout">
      <Sidebar open={menuOpen} />
      <div className="market-content">
        <div className="section-title products-title">
          <h1>{category ? category : query ? `"${query}" qidiruvi` : 'Barcha mahsulotlar'}</h1>
          <span>{filteredItems.length} ta mahsulot</span>
        </div>
        {filteredItems.length > 0 ? (
          <div className="product-grid">
            {filteredItems.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <span>🔍</span>
            <h2>Mahsulot topilmadi</h2>
            <p>Boshqa nom yoki turkum bo‘yicha izlab ko‘ring.</p>
            <Link to="/products">Barcha mahsulotlar</Link>
          </div>
        )}
      </div>
    </main>
  )
}

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const oldTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.oldPrice * item.quantity, 0),
    [items],
  )

  const discount = oldTotal - total

  return (
    <main className="page cart-page">
      <div className="cart-heading">
        <h1> Savat </h1>
        <span>{items.reduce((sum, item) => sum + item.quantity, 0)} ta mahsulot</span>
      </div>
      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-product-image" style={{ background: item.color }}>
                <span>{item.emoji}</span>
              </div>
              <div className="cart-product-info">
                <p className="category">{item.category}</p>
                <h2>{item.name}</h2>
                <p className="seller">Sotuvchi: Market shop</p>
              </div>
              <div className="quantity" aria-label={`${item.name} soni`}>
                <button
                  type="button"
                  onClick={() => dispatch(decrement(item.id))}
                  disabled={item.quantity === 1}
                  aria-label="Soni kamaytirish"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => dispatch(increment(item.id))}
                  aria-label="Soni oshirish"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <del>{formatPrice(item.oldPrice * item.quantity)}</del>
              </div>
              <button
                className="remove-button"
                type="button"
                onClick={() => dispatch(removeItem(item.id))}
                aria-label={`${item.name}ni o'chirish`}
              >
                ×
              </button>
            </article>
          ))}
          {items.length === 0 && (
            <div className="empty-cart">
              <span>🛒</span>
              <h2>Savat bo'sh</h2>
              <Link to="/products">Mahsulotlarni ko'rish</Link>
            </div>
          )}
        </section>

        <aside className="summary">
          <h2>Buyurtmangiz</h2>
          <div className="summary-row">
            <span>Mahsulotlar ({items.reduce((sum, item) => sum + item.quantity, 0)} ta)</span>
            <span>{formatPrice(oldTotal)}</span>
          </div>
          <div className="summary-row discount">
            <span>Chegirma</span>
            <span>-{formatPrice(discount)}</span>
          </div>
          <div className="summary-total">
            <span>Jami to'lov</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="button" className="checkout-button" disabled={!items.length}>
            Rasmiylashtirish
          </button>
        </aside>
      </div>
    </main>
  )
}

function App() {
  const items = useSelector((state) => state.cart.items)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(true)
  const [search, setSearch] = useState('')

  return (
    <>
      <Header
        count={count}
        search={search}
        onSearchChange={setSearch}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <Routes>
        <Route path="/" element={<Home items={items} menuOpen={menuOpen} />} />
        <Route path="/products" element={<Products items={items} menuOpen={menuOpen} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </>
  )
}

export default App
