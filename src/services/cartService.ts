
import { BOOKS } from "../contants/books";

export const cartService ={

    addToCartRequest:async(bookId:string)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const book =BOOKS.find(b=>b.id===bookId);
                resolve(book)
            },500);
        });
    },
    removeFromCartRequest:async(bookId:string)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(bookId);
            },300);
        })
    }
};
