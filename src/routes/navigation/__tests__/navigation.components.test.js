import * as reactRedux from 'react-redux';
import { screen, fireEvent } from '@testing-library/react';
import Navigation from '../navigation.component';
import { renderWithProviders } from '../../../utils/test/test.utils';

import { signOutStart } from '../../../store/user/user.action';


describe('Navigation tests', () => {
    test('It should render a Sign In link and not Sign Out Link if there is no current user', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                user: {
                    currentUser: null,
                }
            }
        });
    
        const signInLinkElement = screen.getByText(/sign in/i);
        expect(signInLinkElement).toBeInTheDocument();
    
        const signOutLinkElement = screen.queryByText(/sign out/i);
        expect(signOutLinkElement).toBeNull();
    });

    test('It should render Sign Out Link and not Sing In Link if ther is a current user', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        })

        const signOutLinkElement = screen.getByText(/sign out/i); // if returns null it gives an error
        expect(signOutLinkElement).toBeInTheDocument();

        const signInLinkElement = screen.queryByText(/sign in/i);// So we can get null without errors pop
        expect(signInLinkElement).toBeNull();
    });

    test('It should not render a cart dropdown if isCartOpen is false', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                cart: {
                    isCartOpen: false,
                    cartItems: [], // to be easier to test it, we set the items inside the cart to 0, to have the text that is presented in the cart dropdown
                }
            }
        });

        const dropdownTextElement = screen.queryByText(/your cart is empty/i);
        expect(dropdownTextElement).toBeNull();
    });

    test('It should render a cart dropdown if isCartOpen is true', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                cart: {
                    isCartOpen: true,
                    cartItems: [],
                }
            }
        });

        const dropdownTextElement = screen.getByText(/your cart is empty/i);
        expect(dropdownTextElement).toBeInTheDocument();
    });

    test('It should dispatch signOutStart action when clicking on the Sign Out link', async () => {
        const mockDispatch = jest.fn();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    
        renderWithProviders(<Navigation />, {
          preloadedState: {
            user: {
              currentUser: {},
            },
          },
        });
    
        expect(screen.getByText('SIGN OUT')).toBeInTheDocument();
    
        await fireEvent.click(screen.getByText('SIGN OUT'));
    
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(signOutStart());
    
        mockDispatch.mockClear();
      });
    
});