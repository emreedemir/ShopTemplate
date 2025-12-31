import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../src/services/cartService";

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    author: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
};
export const addItemToCartAsync = createAsyncThunk(
    'cart/addItem',
    async (bookId: string) => {
        const response = await cartService.addToCartRequest(bookId);
        return response;
    }
);

export const removeItemFromCartAsync = createAsyncThunk(
    'cart/removeItem',
    async (bookId: string) => {
        const response = await cartService.removeFromCartRequest(bookId);
        return response;
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemToCartAsync.fulfilled, (state, action: any) => {
                const book = action.payload;
                const existingItem = state.items.find(item => item.id === book.id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.items.push({ ...book, quantity: 1 });
                }
            
                state.totalAmount = Number((state.totalAmount + book.price).toFixed(2));
            })
            .addCase(removeItemFromCartAsync.fulfilled, (state, action: any) => {
                const bookId = action.payload;
                const index = state.items.findIndex(item => item.id === bookId);

                if (index !== -1) {
                    const item = state.items[index];

                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        state.items.splice(index, 1);
                    }
                
                    const newTotal = state.totalAmount - item.price;
                    state.totalAmount = newTotal > 0 ? Number(newTotal.toFixed(2)) : 0;
                }
            });
    }
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;