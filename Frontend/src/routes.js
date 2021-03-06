import React from "react";
import{BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';                          // Oficial
import Register from './pages/Register';                    // Oficial
import Profile from './pages/Profile';
import Produto from './pages/Product';
import Carrinho from './pages/Carrinho'



export default function Routes(){
    
    return(
        
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/profile" exact component={Profile}/>
                <Route path="/produto/:id" component={Produto}/>
                <Route path="/carrinho" component={Carrinho}/>
            </Switch>
        </BrowserRouter>
        
    );
}