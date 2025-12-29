import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

import { cartService } from "../../src/services/cartService";

interface CartState
{
    items:any[];
    totalAmount:number;
    loading:boolean;
}

const initialState:CartState={
    items:[],
    totalAmount:0,
    loading:false
};

export const addItemToCartAsync =createAsyncThunk(
    'cart/addItem',
    async (bookId:string)=>{
        const response =await cartService.addToCartRequest(bookId);
        return response;
    }
);


const cartSlice =createSlice({
    name:'cart',
    initialState,
    reducers:{
        removeItem:(state,action)=>{
            state.items=state.items.filter(item=>item.id !==action.payload);
            state.totalAmount =state.items.reduce((sum,item)=>sum +item.price,0);
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addItemToCartAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(addItemToCartAsync.fulfilled,(state,action:any)=>{
            state.loading=false;
            state.items.push(action.payload);
            state.totalAmount +=action.payload.price;
        })
        .addCase(addItemToCartAsync.rejected,(state)=>{
            state.loading=false;
        })
    }
});

export const{removeItem}=cartSlice.actions;
export default cartSlice.reducer;





