import React from 'react';

const Modal = ({sku, func, price, isActive}) => {
  return(
    <div className={isActive ? 'modal is-active':'modal'} id='addcart'>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add to Cart</p>
            <button className="delete" onClick={func} aria-label="close"></button>
          </header>
          <section className="modal-card-body">
           <p>{sku}</p>
           <p>Price: &#8369;{price}</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={func}>Confirm</button>
            <button className="button" onClick={func}>Cancel</button>
          </footer>
        </div>
      </div>
  );
};

export default Modal;
