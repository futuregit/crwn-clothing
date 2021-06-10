import { call, all, takeLatest, takeEvery, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../../redux/cart/cart.types';
import { clearCart, addItem } from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { addItemToCart } from './cart.utils';
import { 
    getCurrentUser, 
    storeCartItems, 
    getCartItemsFromFirestore,
    getUserCartRef
} from '../../firebase/firebase.utils';

export function* clearCartOnSignOut() {
    yield put(clearCart());
};

export function* addItemToBackend() {
    //Use selectors for below to get current user
     const testUser = yield getCurrentUser();
     console.log("This is testUser: ", testUser);
     const cartData = yield getUserCartRef(testUser.uid);
     const cartItems = yield select(selectCartItems)
     yield cartData.update({ cartItems });
     console.log('This is cartData ', cartData)
    // console.log("This is items: ", payload)
    // // const {cartItemArray} = yield getCartItemsFromFirestore(testUser, {payload})
    // // console.log("This is currentCart ", cartItemArray[0]);
    // const userRef = yield storeCartItems(testUser, {payload})
    // console.log("This is userRef 2 ", userRef)
    // yield put(addItem(payload));
};

export function* onSignOutSuccess() {
    yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
};

export function* onAddItem() {
    yield takeEvery(CartActionTypes.ADD_ITEM, addItemToBackend);
};

export function* cartSagas() {
    yield all([
        call(onSignOutSuccess),
        call(onAddItem)
    ]);
};