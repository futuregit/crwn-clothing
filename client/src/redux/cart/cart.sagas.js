import { call, all, takeLatest, takeEvery, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../../redux/cart/cart.types';
import { clearCart, addItem } from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { selectCurrentUser } from '../user/user.selectors';
import { addItemToCart } from './cart.utils';

import {getUserCartRef} from '../../firebase/firebase.utils';

export function* clearCartOnSignOut() {
    yield put(clearCart());
};

export function* addItemToBackend() {
    //Use selectors for below to get current user
     const currentUser = yield select(selectCurrentUser);
     const cartData = yield getUserCartRef(currentUser.id);
     const cartItems = yield select(selectCartItems)
     yield cartData.update({ cartItems });
};

export function* onSignOutSuccess() {
    yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
};

export function* onAddItem() {
    yield takeLatest(
       [ CartActionTypes.ADD_ITEM,
        CartActionTypes.REMOVE_ITEM,
        CartActionTypes.CLEAR_ITEM_FROM_CART] , 
        addItemToBackend);
};

export function* cartSagas() {
    yield all([
        call(onSignOutSuccess),
        call(onAddItem)
    ]);
};