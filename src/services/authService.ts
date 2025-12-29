import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth ,db} from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

class AuthService
{
    subscribe(callback:(user:FirebaseUser|null)=>void){
        return onAuthStateChanged(auth,callback);
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