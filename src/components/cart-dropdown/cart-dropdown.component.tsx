import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../store/cart/cart.selector';

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';


import { CartDropdownContainer, CartItemsContainer } from './cart-dropdown.styles';

const CartDropdown = () => {

    const cartItems = useSelector(selectCartItems);

    const navigate = useNavigate();

    const goToCheckoutHandler = () => {
        navigate('/checkout')
    }

    return (
        <CartDropdownContainer>
            <CartItemsContainer>
                {cartItems.map(item => <CartItem key={item.id} cartItem={item} />)}
            </CartItemsContainer>
            <Button onClick={goToCheckoutHandler}>Checkout</Button>
        </CartDropdownContainer>
    )
};

export default CartDropdown;