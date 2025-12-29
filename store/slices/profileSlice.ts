import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Hazırlanıyor' | 'Yolda' | 'İletildi';
}

interface ProfileState {
  user: { name: string; email: string };
  addresses: string[];
  cards: string[];
  orders: Order[];
}

const initialState: ProfileState = {
  user: { name: 'Ahmet Yılmaz', email: 'ahmet@mail.com' },
  addresses: ['Ev: Kadıköy, İstanbul', 'İş: Beşiktaş, İstanbul'],
  cards: ['**** **** **** 4242', '**** **** **** 1111'],
  orders: [
    { id: '101', date: '28.12.2025', total: 120.50, status: 'Yolda' },
    { id: '102', date: '25.12.2025', total: 85.00, status: 'İletildi' },
  ]
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<{ name?: string; email?: string }>) => {
      state.user = { ...state.user, ...action.payload };
    },
    addAddress: (state, action: PayloadAction<string>) => {
      state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<number>) => {
      state.addresses.splice(action.payload, 1);
    },
    addCard: (state, action: PayloadAction<string>) => {
      state.cards.push(action.payload);
    },
    removeCard: (state, action: PayloadAction<number>) => {
      state.cards.splice(action.payload, 1);
    },
  }
});

export const { updateUser, addAddress, removeAddress, addCard, removeCard } = profileSlice.actions;
export default profileSlice.reducer;