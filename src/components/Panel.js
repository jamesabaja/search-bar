import React from 'react';

const Panel = (props) => {
  return(
    <nav className='panel'>
      <p className='panel-heading'>
        Search Medicines Module Hello
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
      <span dangerouslySetInnerHTML={{__html: val.molecule}}/> (<span dangerouslySetInnerHTML={{__html: val.brand}}/>)
      <p>{val.strength} {val.form} &#8369;{val.unit_price}</p>
      </div> :
      <p>{val.sku}<br/>{val.strength} {val.form} &#8369;{val.unit_price} </p>}
      </a>)}
      </div>
    </nav>
  );
}

export default Panel;