import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchOrderHistory } from "../store/orderHistory";

export class OrderHistory extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.props.loadOrderHistory(this.props.auth.id);
  }
  render() {
    let items = this.props.history || [];

    return (
      <div className="cartItem">
        {items.map((el, index) => {
          let arr = el.order_products.map((el) => {
            return (
              <div key={el.product.id} className="order-card">
                <img src={el.product.imageUrl} className="order-img"/>
                <div className="order-details">
                  <h5>{el.product.name}</h5>
                  <h5>Description : {el.product.description}</h5>
                  <h5>Quantity : {el.quantity}</h5>
                  <h5>Subtotal: ${el.quantity * el.product.price / 100}</h5>
                </div>
              </div>
            );
          });

          return (
            <div key={el.id}>
              <h4>Order {index + 1} - {Date(el.updatedAt).slice(4, 16)}</h4>
              <h5>Total: ${el.order_products.reduce((accumulator, currentProduct) => accumulator + currentProduct.quantity * currentProduct.product.price, 0) / 100}</h5>
              <h5>{arr}</h5>
              <hr />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    auth: state.auth,
    history: state.orderHistory,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadOrderHistory: (id) => {
      dispatch(fetchOrderHistory(id));
    },
  };
};

export default connect(mapState, mapDispatch)(OrderHistory);
