import { TouchableOpacity,StyleSheet ,Image, View,Text} from "react-native";
import { COLORS } from "../src/contants/colors";
import { Ionicons } from "@expo/vector-icons";

interface BookCardProps
{
    item:any,
    onAddToCart:()=>void;
    onPress:()=>void;
}

export const BookCard = ({ item ,onPress,onAddToCart}: BookCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
        <View style={styles.footer}>
            <Text style={styles.price}>{item.price} TL</Text>
            <TouchableOpacity style={styles.addButton}
            onPress={onAddToCart}>
                <Ionicons name="cart-outline" size={20} color="#fff"/>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 5
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  author: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 4,
  },
  footer:
  {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:'auto'
  },
  addButton:
  {
    backgroundColor:COLORS.primary,
    padding:6,
    borderRadius:8
  }
});