import React, { useEffect, useState } from 'react';
import { 
    ScrollView, StyleSheet, Image, View, Text, 
    TouchableOpacity, Dimensions, Alert, Modal, TextInput, 
    ActivityIndicator 
} from "react-native";
import { COLORS } from "../src/contants/colors";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { addItemToCartAsync } from '../store/slices/cartSlice';
import { commentService, Comment } from '../src/services/commentService';

const { width } = Dimensions.get('window');

export const BookDetailScreen = ({ route }: any) => {
    const { book } = route.params;
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);    
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [book.id]);

    const fetchComments = async () => {
        setLoadingComments(true);
        const data = await commentService.getCommentsByBook(book.id);
        setComments(data);
        setLoadingComments(false);
    };

    const hasPurchased = user?.orders?.some((order: any) => 
        order.items.some((item: any) => item.id === book.id)
    );

    const submitComment = async () => {
        if (userRating === 0 || userComment.trim().length < 5) {
            return Alert.alert("Uyarı", "Lütfen geçerli bir puan ve yorum girin.");
        }

        setIsSubmitting(true);
        try {
            if (editingCommentId) {
                await commentService.updateComment(book.id, editingCommentId, {
                    text: userComment,
                    rating: userRating
                });
            } else {
                await commentService.addComment(book.id, {
                    userName: user?.displayName || "Okur",
                    text: userComment,
                    rating: userRating
                });
            }
            setIsModalVisible(false);
            setEditingCommentId(null);
            setUserComment('');
            setUserRating(0);
            fetchComments();
        } catch (error) {
            Alert.alert("Hata", "İşlem tamamlanamadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (commentId: string) => {
        Alert.alert("Yorumu Sil", "Bu yorumu kalıcı olarak silmek istiyor musunuz?", [
            { text: "Vazgeç", style: "cancel" },
            { 
                text: "Sil", 
                style: "destructive", 
                onPress: async () => {
                    await commentService.deleteComment(book.id, commentId);
                    fetchComments();
                } 
            }
        ]);
    };

    const handleEdit = (item: Comment) => {
        setEditingCommentId(item.id!);
        setUserComment(item.text);
        setUserRating(item.rating);
        setIsModalVisible(true);
    };

    const renderStars = (rating: number, size = 16, interactive = false) => (
        <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} disabled={!interactive} onPress={() => setUserRating(star)}>
                    <Ionicons name={star <= rating ? "star" : "star-outline"} size={size} color="#f1c40f" />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: book.image }} style={styles.detailImage} />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{book.title}</Text>
                            <Text style={styles.author}>{book.author}</Text>
                        </View>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{book.category}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Açıklama</Text>
                    <Text style={styles.description}>{book.description}</Text>

                    <View style={styles.divider} />
                    
                    <View style={styles.commentHeaderRow}>
                        <Text style={styles.sectionTitle}>Yorumlar ({comments.length})</Text>
                        {hasPurchased && (
                            <TouchableOpacity onPress={() => { setEditingCommentId(null); setIsModalVisible(true); }}>
                                <Text style={styles.addCommentText}>Yorum Yap</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {loadingComments ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        comments.map((item) => (
                            <View key={item.id} style={styles.commentCard}>
                                <View style={styles.commentInfo}>
                                    <View>
                                        <Text style={styles.commentUser}>{item.userName}</Text>
                                        {renderStars(item.rating)}
                                    </View>
                                    {item.userName === user?.displayName && (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                                <Ionicons name="pencil" size={18} color={COLORS.primary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(item.id!)} style={{ marginLeft: 15 }}>
                                                <Ionicons name="trash" size={18} color="#e74c3c" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.commentText}>{item.text}</Text>
                            </View>
                        ))
                    )}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingCommentId ? "Yorumu Düzenle" : "Yorum Yaz"}</Text>
                        <View style={styles.starPicker}>{renderStars(userRating, 40, true)}</View>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="Düşüncelerini paylaş..."
                            value={userComment}
                            onChangeText={setUserComment}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={submitComment}>
                                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Kaydet</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.priceLabel}>Fiyat</Text>
                    <Text style={styles.priceText}>{book.price} TL</Text>
                </View>
                <TouchableOpacity style={styles.buyButton} onPress={() => dispatch(addItemToCartAsync(book.id))}>
                    <Text style={styles.buyButtonText}>Sepete Ekle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    imageContainer: { backgroundColor: '#F5F5F5', width: width, height: 420, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    detailImage: { width: width * 0.55, height: '80%', borderRadius: 10, resizeMode: 'stretch' },
    infoContainer: { padding: 25 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
    author: { fontSize: 16, color: '#666' },
    categoryBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    categoryText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    description: { fontSize: 15, color: '#555', lineHeight: 22 },
    commentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    addCommentText: { color: COLORS.primary, fontWeight: 'bold' },
    commentCard: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, marginBottom: 12 },
    commentInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    commentUser: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    actionButtons: { flexDirection: 'row', alignItems: 'center' },
    commentText: { color: '#666', fontSize: 14, lineHeight: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 25, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    starPicker: { alignItems: 'center', marginBottom: 20 },
    textInput: { backgroundColor: '#F0F0F0', borderRadius: 15, padding: 15, height: 120, textAlignVertical: 'top', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', gap: 10 },
    cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
    cancelBtnText: { color: '#999', fontWeight: 'bold' },
    submitBtn: { flex: 2, backgroundColor: COLORS.primary, padding: 15, borderRadius: 15, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontWeight: 'bold' },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: 35 },
    priceLabel: { fontSize: 13, color: '#999' },
    priceText: { fontSize: 24, fontWeight: '900', color: '#27ae60' },
    buyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 35, paddingVertical: 14, borderRadius: 15 },
    buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: '#fff', padding: 8, borderRadius: 12, elevation: 5 }
});