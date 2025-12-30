import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth ,db} from "./firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

class AuthService
{
    subscribe(callback:(user:FirebaseUser|null)=>void){
        return onAuthStateChanged(auth,callback);
    }

    async addAddress(uid: string, newAddress: string) {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddress)
        });
    }
    async addCard(uid: string, newCard: string) {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
            cards: arrayUnion(newCard)
        });
    }

    async processPurchase(uid:string,cartItems:any[],totalPrice:number)
    {
        const userDocRef =doc(db,"users",uid);
        const newOrder ={
            id:Math.random().toString(36).substr(2,9).toUpperCase(),
            date:new Date().toLocaleString('tr-TR'),
            items:cartItems,
            total:totalPrice,
            status:"Hazırlanıyor"
        };

        await updateDoc(userDocRef,{
            orders:arrayUnion(newOrder),
            cart:[]
        });

        return newOrder;
    }

    async register(email:string,pass:string,userName:string){
        const result =await createUserWithEmailAndPassword(auth,email,pass);
        const uid =result.user.uid;

        const userData={
            uid,
            email,
            displayName:userName,
            cart:[],
            orders:[],
            addresses:[],
            cards:[],
            createdAt:new Date().toISOString()
        };
        await setDoc(doc(db,'users',uid),userData);
        return userData;
    }

    async login(email:string,pass:string){
        return await signInWithEmailAndPassword(auth,email,pass);
    }

    async getUserData(uid:string){
        const userDoc =await getDoc(doc(db,"users",uid));
        return userDoc.exists()?userDoc.data():null;
    }

    async logout(){
        await signOut(auth);
    }
}

export const authService =new AuthService();