import {getLocales} from 'expo-localization';

const tr={
    titles:{
        shopName:'Magaza',
        home:'Ana Sayfa',
        cart:'Sepetim'
    }
    ,homeScreen:
    {
        welcome:'E-Ticaret Sayfamıza Hoşgeldin',
        subtitle:'Burası Alt Başlık'
    },
    buttons:
    {
        addToCart:'Sepete Ekle'
    }
};

const en: typeof tr ={
    titles:{
        shopName:'Shop',
        home:'Home',
        cart:'My Cart'
    },
    homeScreen:{
        welcome:'Welcome To E-Commerce Application',
        subtitle:'This is Footer Text'
    },
    buttons:{
        addToCart:'Add To Cart'
    }
};

const deviceLanguage =getLocales()[0].languageCode;
export const STRINGS =deviceLanguage==='tr'?tr:en;


