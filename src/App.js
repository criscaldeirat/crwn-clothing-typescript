import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Suspense, useEffect } from "react";
import { GlobalStyle } from './global.styles';
import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import Authentication from './routes/authenticator/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import { checkUserSession } from './store/user/user.action';
import Spinner from './components/spinner/spinner.component';

const App = () => {
  const dispatch = useDispatch();

  // * USER
  useEffect(() => {
    dispatch(checkUserSession())
  }, [])

  return (
    <Suspense fallback={<Spinner/>}>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index={true} element={<Home/>} />
          <Route path='shop/*' element={<Shop/>} />
          <Route path='auth' element={<Authentication/>} />
          <Route path='checkout' element={<Checkout />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App;
