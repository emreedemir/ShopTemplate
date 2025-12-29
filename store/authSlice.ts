import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState
{
    user:any|null;
    isInitiliazed:boolean,
    loading:boolean
}

const initialState:AuthState={
    user:null,
    isInitiliazed:false,
    loading:false
};


const authSlice =createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<any>)=>{
            state.user =action.payload;
            state.isInitiliazed=true;
        },
        setLoading:(state,action:PayloadAction<boolean>)=>{
            state.loading=action.payload;
        },
        logout:(state)=>{
            state.user=null;
        },
    },
});

export const{setUser,setLoading,logout}=authSlice.actions;
export default authSlice.reducer;