import { db } from "./firebase";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    limit, 
    startAfter, 
    orderBy, 
    QueryDocumentSnapshot 
} from "firebase/firestore";

class BookService {

    private collectionRef = collection(db, "products");

    async getHomeData() {
        try {
            const q = query(this.collectionRef, limit(20));
            const querySnapshot = await getDocs(q);
            const all = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return {
                newArrivals: all.slice(0, 10),
                recommended: all.slice(10, 20)
            };
        } catch (error) {
            console.error("Home data fetch error:", error);
            throw error;
        }
    }

    async getBooksPaginated(category: string | null = null, lastVisibleDoc: any = null) {
        const PAGE_SIZE = 10;
        let q;

        let constraints: any[] = [orderBy("title"), limit(PAGE_SIZE)];
        if (category) {
            constraints.unshift(where("category", "==", category));
        }

        if (lastVisibleDoc) {
            constraints.push(startAfter(lastVisibleDoc));
        }

        q = query(this.collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        const books = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { books, lastVisible };
    }
}

export const bookService = new BookService();