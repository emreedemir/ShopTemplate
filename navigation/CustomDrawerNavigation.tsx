import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CATEGORIES } from "../src/contants/categories";

export const CustomDrawerContent =(props:any)=>{
    return(
        <DrawerContentScrollView {...props}>
            {CATEGORIES.map((category)=>(
                <DrawerItem
                    key={category.id}
                    label={category.name}
                    onPress={()=>props.navigation.navigate('CategoryScreen',{categoryName:category.name})}
                />
            ))}
        </DrawerContentScrollView>
    );
};