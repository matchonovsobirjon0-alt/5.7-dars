import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      name: "Ayollar uchun krossovkalar",
      category: 'Poyabzal',
      price: 246070,
      oldPrice: 369100,
      quantity: 1,
      color: '#e8ecff',
      emoji: '👟',
    },
    {
      id: 2,
      name: 'Quruq ovqat uchun toza mahsulot',
      category: 'Oziq-ovqat',
      price: 99950,
      oldPrice: 195000,
      quantity: 5,
      color: '#fff2dc',
      emoji: '🍯',
    },
    {
      id: 3,
      name: 'Samsung Galaxy A25 Ultra',
      category: 'Elektronika',
      price: 1447300,
      oldPrice: 1750500,
      quantity: 3,
      color: '#dfeeff',
      emoji: '📱',
    },
    {
      id: 4,
      name: 'MacBook Air M2',
      category: 'Noutbuklar',
      price: 11290000,
      oldPrice: 12450000,
      quantity: 1,
      color: '#e9e9e9',
      emoji: '💻',
    },
    {
      id: 5,
      name: 'Apple AirPods Pro',
      category: 'Aksessuarlar',
      price: 1890000,
      oldPrice: 2150000,
      quantity: 2,
      color: '#edf0f7',
      emoji: '🎧',
    },
  ],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) item.quantity = Math.max(1, quantity)
    },
    increment(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity += 1
    },
    decrement(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity = Math.max(1, item.quantity - 1)
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { setQuantity, increment, decrement, removeItem } = cartSlice.actions
export default cartSlice.reducer
