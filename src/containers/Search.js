import React, { Component } from 'react';
import Modal from '../components/Modal';
import Panel from '../components/Panel';
import axios from 'axios';

class Search extends Component {

  /*
  * Function: constructor
  * Parameter/s: props
  * Description: Constructor function of the class.
  */

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.openModal = this.openModal.bind(this);
    this.clickModal = this.clickModal.bind(this);
    this.getMolecule = this.getMolecule.bind(this);
    this.getBrand = this.getBrand.bind(this);
    this.state = {
      value: '',
      json_value: [],
      loading: false,
      search: [],
      empty: 0,
      sku: '',
      price: '',
      fuzzy: false,
      falseMatch: ''
    };
  }

  /*
  * Function: modalClose
  * Parameter/s: none
  * Description: This function closes the modal when called.
  * 
  */ 

  modalClose() {
    document.getElementById('addcart').classList.remove('is-active');
  }

  /*
  * Function: openModal
  * Parameter/s: none
  * Description: This function opens a modal when a certain 
  * item is selected (through the ENTER key). It gets all 'a'
  * tags and gets the data from whatever 'a' tag is active,
  * and displays it in the modal. 
  */ 

  openModal() {
    var isActive = document.getElementById("addcart").classList.toggle('is-active');
    if(isActive) {
      var links = document.getElementsByTagName("a");
      var values;
      for(var i = 0; i < links.length; i++) {
        if(links[i].classList.contains('is-active')) {
          values = links[i].name.split(',');
          break;
        }
      }
      this.setState({
        sku: values[0],
        price: values[1]
      });
    }
  }

  /* 
  * Function: clickModal
  * Parameter/s: name (type STRING)
  * Description: This is the function that is executed when 
  * a certain search item is clicked. The parameter 'name' 
  * contains the SKU and Unit Price of the selected item,
  * separated by a comma. Afterwards, it opens the modal 
  * containing the data obtained from the parameters. 
  */

  clickModal(name) {
    name = name.split(',');
    var isActive = document.getElementById("addcart").classList.toggle('is-active');
    if(isActive) {
      this.setState({
        sku: name[0],
        price: name[1]
      });
    }
  }

  /*
  * Function: getTags
  * Parameter/s: list (type OBJECT ARRAY), input (type STRING)
  * Description: Filters the list and returns the items
  * that contain the current search input in their tags.
  * Uses Strict String Matching.
  */

  getTags(list, input) {
    list = list.filter((item) => {
      if(typeof item.tags !== 'string') {
        item.tags = item.tags.join('|');
      }
      let willRet = false;
      item.tags = item.tags.split('|');
      for(let i = 0; i < item.tags.length; i++) {
        let tag = item.tags[i];
        if(tag.toLowerCase().indexOf(input) !== -1) {
          willRet = true;
          break;
        }
      }
      return willRet;
    });
    return list;
  }

  /*
  * Function: getMolecule
  * Parameter/s: list (type OBJECT ARRAY), input (type STRING)
  * Description: Filters the list and returns the items
  * that contain the current search input in their 
  * molecule. Uses Strict String Matching.
  */

  getMolecule(list, input) {
    list = list.filter((item) => {
      if(item.molecule === null) {
        item.molecule = item.sku;
      }else {
        item.molecule = item.molecule.replace('<b>', '');
        item.molecule = item.molecule.replace('</b>', '');
        item.brand = item.brand.replace('<b>', '');
        item.brand = item.brand.replace('</b>', '');
      }
      if(item.form === null) {
        item.form = item.sku;
      }
      item['index_of'] = item.molecule.toLowerCase().indexOf(input);
      var value = item['index_of'] !== -1;
      if(value === true) {
        var sub = '';
        for(let x = item['index_of']; x <= item['index_of'] + input.length - 1; x++) {
          sub = sub + item.molecule[x];
        }
        item.molecule = item.molecule.replace(sub, '<b>'+sub+'</b>');
      }
      return value;
    });
    return list;
  }

  /*
  * Function: getBrand
  * Parameter/s: list (type OBJECT ARRAY), input (type STRING)
  * Description: Filters the list and returns the items
  * that contain the current search input in their brand.
  * Uses Strict String Matching.
  */

  getBrand(list, input) {
    var molecule = '';
    var prevVal = false;
    list = list.filter((item) => {
      item.brand = item.brand.replace('<b>', '');
      item.brand = item.brand.replace('</b>', '');
      item['index_of'] = item.brand.toLowerCase().indexOf(input);
      var value = item['index_of'] !== -1;
      if(value) {
        prevVal = true;
        var sub = '';
        for(let x = item['index_of']; x <= item['index_of'] + input.length - 1; x++) {
          sub = sub + item.brand[x];
        }
        item.brand = item.brand.replace(sub, '<b>'+sub+'</b>');
      }
      if(molecule === '') {
        molecule = item.molecule;
      }else {
        if(molecule !== item.molecule) {
          molecule = item.molecule;
          prevVal = false;
        }else if(item.brand === 'Value Brand' && prevVal === true) {
          value = true;
          prevVal = false;
        } 
      }
      return value;
    });
    return list;
  }

  /*
  * Function: handleChange
  * Parameter/s: event
  * Description: This function filters the data based on the 
  * text being currently displayed every time the function is
  * called. It compiles the filtered data and sorts it, and
  * assigns it to a state variable ready to be displayed. 
  */

  handleChange(event) {
    if(event.target.value === '') {
      this.setState({
        search: [],
        empty: 3,
        fuzzy: false
      });
      /* 
       * this.state.empty values:
       * 3: empty search input
       * 2: search unsuccessful
       * 1: search successful
       */
    } else {
      var itemList = this.state.json_value;
      var inputText = event.target.value.toLowerCase();
      itemList = this.getMolecule(itemList, inputText);
      if(itemList.length === 0) {
        itemList = this.state.json_value;
        itemList = this.getBrand(itemList, inputText);
        if(itemList.length === 0) {
          itemList = this.state.json_value;
          itemList = this.getTags(itemList, inputText);
          if(itemList.length === 0) {
            /*
            * Brand & molecule not found, apply fuzzy search
            * Molecule first (using Levenshtein's Distance/Algorithm)
            */
            itemList = this.state.json_value;
            itemList = itemList.filter((item) => {
              var n = item.molecule.length;
              var m = inputText.length;
              var matrix = [];
              for(let x = 0; x <= n; x++) {
                matrix[x] = new Array(m+1);
              }
              for(let x = 0; x <= n; x++) {
                matrix[x][0] = x;
              }
              for(let y = 0; y <= m; y++) {
                matrix[0][y] = y;
              }
              for(let x = 1; x <= n; x++) {
                let mChar = item.molecule[x-1].toLowerCase();
                for(let y = 1; y <= m; y++) {
                  let sChar = inputText[y-1];
                  let cost = 1;
                  if(mChar === sChar) {
                    cost = 0;
                  }
                  matrix[x][y] = Math.min(matrix[x][y-1] + 1, matrix[x-1][y] + 1, matrix[x-1][y-1] + cost);
                }
              }
              item.levenDist = matrix[n][m];
              if(n >= m) {
                item.levenDist /= n;
              }else {
                item.levenDist /= m;
              }

              /* 
              * Fuzzy search on brand, update 
              * levenshtein distance if value is 
              * smaller than molecule's levenshtein
              * distance
              */

              n = item.brand.length;
              matrix = [];
              for(let x = 0; x <= n; x++) {
                matrix[x] = new Array(m+1);
              }
              for(let x = 0; x <= n; x++) {
                matrix[x][0] = x;
              }
              for(let y = 0; y <= m; y++) {
                matrix[0][y] = y;
              }
              for(let x = 1; x <= n; x++) {
                let mChar = item.brand[x-1].toLowerCase();
                for(let y = 1; y <= m; y++) {
                  let sChar = inputText[y-1];
                  let cost = 1;
                  if(mChar === sChar) {
                    cost = 0;
                  }
                  matrix[x][y] = Math.min(matrix[x][y-1] + 1, matrix[x-1][y] + 1, matrix[x-1][y-1] + cost);
                }
              }

              var temp = matrix[n][m];

              if(n >= m) {
                temp /= n;
              } else {
                temp /= m;
              }

              if(temp < item.levenDist) {
                item.levenDist = temp;
              }
              return item;
            });

            itemList = itemList.sort((a, b) => {
              if(a.levenDist - b.levenDist === 0) {
                var comp = a.molecule.localeCompare(b.molecule);
                if(comp === 0) {
                  var a_value = a.form === 'Tablet' ? 7 : a.form === 'Capsule' ? 6 : a.form === 'Syrup' ? 5 : a.form === 'Suspension' ? 4 : a.form === 'Drops' ? 3 : a.form === 'Gel' ? 2 : a.form === 'Lotion' ? 1 : 0;
                  var b_value = b.form === 'Tablet' ? 7 : b.form === 'Capsule' ? 6 : b.form === 'Syrup' ? 5 : b.form === 'Suspension' ? 4 : b.form === 'Drops' ? 3 : b.form === 'Gel' ? 2 : b.form === 'Lotion' ? 1 : 0;
                  return b_value - a_value;
                }
                return comp;
              }
              return a.levenDist - b.levenDist;
            });
            this.setState({
              fuzzy: true
            });
          }else {
            this.setState({
              fuzzy:false
            });
            /*
            * Search by tag successful,
            * sort filtered items 
            */
            itemList = itemList.sort((a, b)=> {
              if(a.index_of === b.index_of) {
                var comp = a.molecule.localeCompare(b.molecule);
                if(comp === 0) {
                  var a_value = a.form === 'Tablet' ? 7 : a.form === 'Capsule' ? 6 : a.form === 'Syrup' ? 5 : a.form === 'Suspension' ? 4 : a.form === 'Drops' ? 3 : a.form === 'Gel' ? 2 : a.form === 'Lotion' ? 1 : 0;
                  var b_value = b.form === 'Tablet' ? 7 : b.form === 'Capsule' ? 6 : b.form === 'Syrup' ? 5 : b.form === 'Suspension' ? 4 : b.form === 'Drops' ? 3 : b.form === 'Gel' ? 2 : b.form === 'Lotion' ? 1 : 0;
                  var res = b_value - a_value;
                  if(res === 0) {
                    if(a.brand === 'Value Brand') {
                      return -100;
                    }else if(b.brand === 'Value Brand') {
                      return 100;
                    }
                    return a.brand.localeCompare(b.brand);
                  }
                  return res;
                }
                return comp;
              }else if(a.index_of > b.index_of) {
                return 1;
              }
              return -1;
            });
          }
        }else {
          this.setState({
            fuzzy:false
          });
          /*
          * Search by brand successful,
          * sort filtered items 
          */
          itemList = itemList.sort(function(a, b) {
            var comp = a.molecule.localeCompare(b.molecule);
            if(comp === 0) {
              var a_value = a.form === 'Tablet' ? 7 : a.form === 'Capsule' ? 6 : a.form === 'Syrup' ? 5 : a.form === 'Suspension' ? 4 : a.form === 'Drops' ? 3 : a.form === 'Gel' ? 2 : a.form === 'Lotion' ? 1 : 0;
              var b_value = b.form === 'Tablet' ? 7 : b.form === 'Capsule' ? 6 : b.form === 'Syrup' ? 5 : b.form === 'Suspension' ? 4 : b.form === 'Drops' ? 3 : b.form === 'Gel' ? 2 : b.form === 'Lotion' ? 1 : 0;
              var res = b_value - a_value;
              if(res === 0) {
                return a.brand.localeCompare(b.brand);
              }
              return res;
            }
            return comp;
          });
        }
      }else {
        this.setState({
          fuzzy:false
        });
        /*
        * Search by molecule successful,
        * sort filtered items 
        */
        itemList = itemList.sort((a, b)=> {
          if(a.index_of === b.index_of) {
            var comp = a.molecule.localeCompare(b.molecule);
            if(comp === 0) {
              var a_value = a.form === 'Tablet' ? 7 : a.form === 'Capsule' ? 6 : a.form === 'Syrup' ? 5 : a.form === 'Suspension' ? 4 : a.form === 'Drops' ? 3 : a.form === 'Gel' ? 2 : a.form === 'Lotion' ? 1 : 0;
              var b_value = b.form === 'Tablet' ? 7 : b.form === 'Capsule' ? 6 : b.form === 'Syrup' ? 5 : b.form === 'Suspension' ? 4 : b.form === 'Drops' ? 3 : b.form === 'Gel' ? 2 : b.form === 'Lotion' ? 1 : 0;
              var res = b_value - a_value;
              if(res === 0) {
                if(a.brand === 'Value Brand') {
                  return -100;
                }else if(b.brand === 'Value Brand') {
                  return 100;
                }
                return a.brand.localeCompare(b.brand);
              }
              return res;
            }
            return comp;
          }else if(a.index_of > b.index_of) {
            return 1;
          }
          return -1;
        });
      }
      /*
       *  Get top 100 results 
       */
      if(itemList.length > 0) {
        var num = 0;
        itemList = itemList.filter((item) => {
          if(num === 100) {
            return false;
          }
          num++;
          return item;
        });
        this.setState({
          empty: 1
        });
      }else {
        this.setState({
          empty: 2
        }); 
      }
      this.setState({
        search: itemList
      });
      //console.log(itemList);
    }
  }

  /*
  * Function: loadData 
  * Parameter/s: none
  * Description: This functions fetches the data from the 
  * server, and stores it in a local state variable.
  */

  loadData() {
    this.setState({
      loading: true
    });
    axios.get('https://medgrocer.com/mg/products').then(response => { 
      this.setState({loading:false, json_value: response.data, search: []}); 
    });
  }

  /* 
  * Function: handleKeyPress
  * Parameter/s: event
  * Description: The function that handles all events
  * everytime a key is pressed. It handles three key
  * events, the ENTER key (Key Code 13), the Arrow 
  * Up key (Key Code 38), and the Arrow Down key (Key
  * Code 40), and performs corresponding functions for
  * each key event.
  */

  handleKeyPress(event) {
    var select;
    switch(event.keyCode) {
      default:
        break;
      case 13: 
        /*
        * ENTER key 
        */
        this.openModal();
        break;
      case 38:
        /*
        * Arrow Up key 
        */
        var index;
        select = document.getElementsByTagName('a');
        for(var i = 0; i < select.length; i++) {
          if(select[i].classList.contains('is-active')) {
            index = i;
            break;
          }
        }
        if(index > 0) {
          select[i].classList.remove('is-active');
          select[i-1].classList.add('is-active');
          select[i-1].scrollIntoView();
        }
        break;
      case 40: 
        /*
        * Arrow Down key 
        */
        select = document.getElementsByTagName('a');
        for(i = 0; i < select.length; i++) {
          if(select[i].classList.contains('is-active')) {
            index = i;
            break;
          }
        }
        if(index < select.length - 1) {
          select[i].classList.remove('is-active');
          select[i+1].classList.add('is-active');
          select[i+1].scrollIntoView();
        }
        break;
    }
  }

  /* 
  * Function: componentWillMount
  * Parameter/s: none
  * Description: Lifecycle function which is executed every-
  * time the component will be loaded. In this function, it 
  * calls the loadData function and adds an event listener
  * for keypress events.
  */

  componentWillMount() {
    this.loadData();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  /*
  * Function: render
  * Parameter/s: none
  * Description: The function that renders the page with the
  * corresponding components it returns.
  */

  render() {
    return (
      <div className='App'>
        <Modal sku={this.state.sku} price={this.state.price} func={this.modalClose}/>
        <Panel onChange={this.handleChange} isLoading={this.state.loading} isEmpty={this.state.empty} search={this.state.search} clickModal={this.clickModal} isFuzzy={this.state.fuzzy}/>
      </div>
    );
  }
}

export default Search;