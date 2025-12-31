import { db } from "./firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    serverTimestamp,
    Timestamp ,
    doc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

export interface Comment {
    id?: string;
    userName: string;
    text: string;
    rating: number;
    createdAt?: any;
}

class CommentService {
    async getCommentsByBook(bookId: string): Promise<Comment[]> {
        try {
            const commentsRef = collection(db, "products", bookId, "comments");
            

            const q = query(commentsRef, orderBy("createdAt", "desc"));
            
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userName: data.userName || "Anonim",
                    text: data.text || "",
                    rating: data.rating || 0,
                    createdAt: data.createdAt
                };
            }) as Comment[];
        } catch (error) {
            console.error("Yorum çekme servisi hatası:", error);
            return [];
        }
    }

    async addComment(bookId: string, commentData: { userName: string; text: string; rating: number }) {
        try {
            const commentsRef = collection(db, "products", bookId, "comments");
            await addDoc(commentsRef, {
                ...commentData,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Yorum ekleme servisi hatası:", error);
            throw error;
        }
    }


async deleteComment(bookId: string, commentId: string) {
    try {
        const commentRef = doc(db, "products", bookId, "comments", commentId);
        await deleteDoc(commentRef);
        return true;
    } catch (error) {
        console.error("Yorum silme hatası:", error);
        throw error;
    }
}

async updateComment(bookId: string, commentId: string, data: { text: string; rating: number }) {
    try {
        const commentRef = doc(db, "products", bookId, "comments", commentId);
        await updateDoc(commentRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Yorum güncelleme hatası:", error);
        throw error;
    }
}
}

export const commentService = new CommentService();