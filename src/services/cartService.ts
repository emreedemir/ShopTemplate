import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const cartService = {
    addToCartRequest: async (bookId: string) => {
        try {
            const docRef = doc(db, "products", bookId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                return { 
                    id: docSnap.id, 
                    title: data.title,
                    price: data.price,
                    image: data.image,
                    author: data.author,
                    category: data.category
                };
            } else {
                throw new Error("Bu ürün artık satışta değil.");
            }
        } catch (error) {
            console.error("Doğrulama Hatası:", error);
            throw error;
        }
    },
    removeFromCartRequest: async (bookId: string) => {
        return new Promise((resolve) => resolve(bookId));
    }
};
