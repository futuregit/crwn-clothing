import { call, all, takeLatest, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../../redux/cart/cart.types';
import { clearCart, setCartFromFirebase } from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { selectCurrentUser } from '../user/user.selectors';

import {getUserCartRef} from '../../firebase/firebase.utils';

export function* clearCartOnSignOut() {
    yield put(clearCart());
};

export function* addAndRemoveItemToBackend() {
    //Use selectors for below to get current user
     const currentUser = yield select(selectCurrentUser);
     if (currentUser) {
         try {
            const cartData = yield getUserCartRef(currentUser.id);
            const cartItems = yield select(selectCartItems)
            yield cartData.update({ cartItems }); 
         }
         catch(error){
             console.log(error);
         }
     }
  
};

export function* getCartFromFirestore({payload: user}) {
    const cartItems = yield select(selectCartItems);
    console.log(cartItems)
    console.log(user.createdAt)
    // if (cartItems <= 0) {
    //     return addAndRemoveItemToBackend();
    // }
    console.log("Went pass if statement")
    const cartRef = yield getUserCartRef(user.id);
    const cartSnapshot = yield cartRef.get();
    console.log(cartSnapshot.data().cartItems)
    if (cartSnapshot.data().cartItems.length <= 0 && cartItems.length > 0 ) {
        return addAndRemoveItemToBackend();
    }
    yield put(setCartFromFirebase(cartSnapshot.data().cartItems));
}

export function* onSignOutSuccess() {
    yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
};

export function* onSignInSuccess() {
    yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, getCartFromFirestore);
};

// export function* onSignUpSuccess() {
//     yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, saveCartToFirestore)
// }

export function* onAddItem() {
    yield takeLatest(
       [ CartActionTypes.ADD_ITEM,
        CartActionTypes.REMOVE_ITEM,
        CartActionTypes.CLEAR_ITEM_FROM_CART
        ], 
        addAndRemoveItemToBackend);
};

export function* cartSagas() {
    yield all([
        call(onSignOutSuccess),
        call(onAddItem),
        call(onSignInSuccess)
    ]);
};