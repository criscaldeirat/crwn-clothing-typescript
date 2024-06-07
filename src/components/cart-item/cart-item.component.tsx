import { FC } from 'react';
import { CartItem as TCartItem } from '../../store/cart/cart.types';
import { CartItemContainer, ItemImage, ItemDetails, ItemName } from './cart-item.styles';

type CartItemProps = {
    cartItem: TCartItem;
}


const CartItem: FC<CartItemProps> = ({ cartItem }) => {
    const {name, imageUrl, price, quantity} = cartItem;
    return (
        <CartItemContainer>
            <ItemImage src={imageUrl} alt={`${name}`} /> 
            <ItemDetails>
                <ItemName>{name}</ItemName><br />
                <span className='price'>{quantity} x ${price}</span>
            </ItemDetails>
        </CartItemContainer>
    )
}

export default CartItem;

