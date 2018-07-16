import React from 'react';

const Panel = (props) => {
  return(
    <nav className='panel'>
      <p className='panel-heading'>
        Search Medicines
      </p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input is-medium" type="text" placeholder="search"  onChange={props.onChange}/>
          <span className="icon is-small is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
      {props.isFuzzy && <div className='panel-block'>
        Cannot find molecule, brand or tag that matches the search description. Did you mean ... 
      </div> }
      {props.isLoading && <p className='center subtitle is-4' style={{paddingTop: '40px'}}>Loading data...</p>}
      {props.isEmpty === 2 && <p className='center subtitle is-4' style={{paddingTop: '40px'}}>No data found.</p>}
      <div style={{overflowY: 'auto', height: '391px'}}>
      {props.search.map((val, i) => 
      <a className={i === 0 ? 'panel-block is-active' : 'a panel-block'} key={i} name={val.sku + ',' + val.unit_price} onClick={() => props.clickModal(val.sku + ',' + val.unit_price)}>
      {val.molecule !== '' && val.form !== '' ? 
      <div>
      <span className='primary-color' dangerouslySetInnerHTML={{__html: val.molecule}}/> <span className='primary-color'>(<span className='primary-color' dangerouslySetInnerHTML={{__html: val.brand}}/>)</span>
      <p>{val.strength} {val.form} </p><p>Price: &#8369;{val.unit_price}</p>
      </div> :
      <div><p><span className='primary-color'>{val.sku}</span><br/>{val.strength} {val.form}</p><p>Price: &#8369;{val.unit_price} </p></div>}
      </a>)}
      {props.search.length === 0 && 
      <div className='panel-block'>
        <div className='tile box center-text'>
          <p className='subtitle is-5'>Search medicines and add them to your cart.</p>
        </div>
      </div>}
      </div>
    </nav>
  );
}

export default Panel;