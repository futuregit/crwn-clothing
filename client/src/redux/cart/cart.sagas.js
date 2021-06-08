import { call, all, takeLatest, takeEvery, put } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../../redux/cart/cart.types';
import { clearCart, addItem } from './cart.actions';
import { addItemToCart } from './cart.utils';
import { getCurrentUser, storeCartItems, getCartItemsFromFirestore } from '../../firebase/firebase.utils';

export function* clearCartOnSignOut() {
    yield put(clearCart());
};

export function* addItemToBackend({payload }) {
    // const testUser = yield getCurrentUser();
    // console.log("This is testUser: ", testUser);
    // console.log("This is items: ", payload)
    // // const {cartItemArray} = yield getCartItemsFromFirestore(testUser, {payload})
    // // console.log("This is currentCart ", cartItemArray[0]);
    // const userRef = yield storeCartItems(testUser, {payload})
    // console.log("This is userRef 2 ", userRef)
    yield put(addItem(payload));
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