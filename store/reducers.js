import { combineReducers } from "redux";
import * as types from "./types";
import axios from "axios";
import { stringify } from "uuid";

const initialState = {
	cartItems: [],
	discount: 0.0,
};

// COUNTER REDUCER
const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.ADD_TO_CART:
			localStorage.setItem("cartItems", [action.data])
			return {
				...state,
				cartItems: [action.data],
			};
		case types.GET_DISCOUNT:
			return {
				...state,
				discount: action.data,
			};

		case types.REMOVE_CART:
			let new_items = state.cartItems.filter(
				(item) => action.id !== item.id
			);
			localStorage.setItem("cartItems", new_items)
			return {
				...state,
				cartItems: new_items,
			};
		case types.RESET_CART:

			return {
				...state,
				cartItems: [],
			};

		case types.LOAD_CART_ITEMS:
			localStorage.setItem("cartItems", JSON.stringify(action.cartItems))
			return {
				...state,
				cartItems: action.cartItems,
			};

		default:
			return state;
	}
};
const reducers = {
	cart: cartReducer,
};

export default combineReducers(reducers);