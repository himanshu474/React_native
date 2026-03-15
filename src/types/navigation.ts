// src/types/navigation.ts (UPDATED)
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { Product } from '../models/Product';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: number; product?: Product };
  Success: undefined;
};

export type MainTabParamList = {
  Products: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  StackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ProductsScreenProps = MainTabScreenProps<'Products'>;
export type CartScreenProps = MainTabScreenProps<'Cart'>;
export type ProfileScreenProps = MainTabScreenProps<'Profile'>;
export type ProductDetailScreenProps = RootStackScreenProps<'ProductDetail'>;
export type SuccessScreenProps = RootStackScreenProps<'Success'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}