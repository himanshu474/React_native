// src/screens/ProductListScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


import { ProductsScreenProps } from '../types/navigation';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../models/Product';
import { useProducts } from '../hooks/useProducts';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { ProductListSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';

const { width } = Dimensions.get('window');
const CARD_MARGIN = spacing.sm;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - (CARD_MARGIN * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

type ProductListNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const ProductListScreen: React.FC<ProductsScreenProps> = () => {
  const navigation = useNavigation<ProductListNavigationProp>();
  const { products, loading, error, refetch, isRefreshing } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { addToCart } = useCart();

    

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      product, // Pass product to avoid extra API call
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    
    // Show feedback
    Alert.alert(
      'Added to Cart',
      `${product.title} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { 
          text: 'View Cart', 
          onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' })
        }
      ]
    );
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Render category chip
  const renderCategoryChip = ({ item }: { item: string }) => (
    <View style={styles.categoryChipContainer}>
      <Text
        style={[
          styles.categoryChip,
          selectedCategory === item && styles.categoryChipSelected,
        ]}
        onPress={() => handleCategoryPress(item)}
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </View>
  );

  // Render product item
  const renderProduct = ({ item }: { item: Product }) => (
  <View style={viewMode === 'grid' ? styles.gridItemWrapper : styles.listItemWrapper}>
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddToCart}
      variant={viewMode}
    />
  </View>
);

  // Loading state with skeletons
  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Products" 
          rightIcon={
            <Ionicons 
              name={viewMode === 'grid' ? 'list' : 'grid'} 
              size={24} 
              color={colors.textPrimary} 
              onPress={toggleViewMode}
            />
          }
        />
        <ProductListSkeleton />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Products" />
        <EmptyState
          title="Oops! Something went wrong"
          message={error}
          icon={<Ionicons name="alert-circle" size={48} color={colors.error} />}
          actionLabel="Try Again"
          onAction={refetch}
        />
      </View>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Products" />
        <EmptyState
          title="No Products Found"
          message="Check back later for new products"
          icon={<Ionicons name="bag" size={48} color={colors.grey500} />}
          actionLabel="Refresh"
          onAction={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Products" 
        rightIcon={
          <Ionicons 
            name={viewMode === 'grid' ? 'list' : 'grid'} 
            size={24} 
            color={colors.textPrimary} 
            onPress={toggleViewMode}
          />
        }
      />

      {/* Categories horizontal scroll */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products grid/list */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={[
          styles.productList,
          viewMode === 'grid' && styles.gridList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          filteredProducts.length === 0 ? (
            <EmptyState
              title={`No products in ${selectedCategory}`}
              message="Try selecting another category"
              icon={<Ionicons name="filter" size={48} color={colors.grey500} />}
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryChipContainer: {
    marginRight: spacing.sm,
  },
  categoryChip: {
    ...typography.variants.body2,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.grey100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  productList: {
    padding: spacing.md,
  },
  gridList: {
    paddingHorizontal: spacing.sm,
  },
  gridItemWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: spacing.md,
  },
  listItemWrapper: {
    width: '100%',
    marginBottom: spacing.sm,
  },
//   productList: {
//     padding: spacing.sm,
//   },
//   gridList: {
//     justifyContent: 'space-between',
//   },
});

export default ProductListScreen;

function addToCart(product: Product, arg1: number) {
    throw new Error('Function not implemented.');
}
