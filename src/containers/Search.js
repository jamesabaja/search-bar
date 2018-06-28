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
    this.getFormValue = this.getFormValue.bind(this);
    this.getLevDistance = this.getLevDistance.bind(this);
    this.state = {
      value: '',
      jsonValues: [],
      loading: false,
      searchResults: [],
      empty: 0,
      sku: '',
      price: '',
      isFuzzy: false,
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
    /*
     * Open modal by adding 'is-active' to its classlist 
     */
    let isActive = document.getElementById("addcart").classList.toggle('is-active');
    if(isActive) {
      /*
       * Get all elements with the 'a' tag, and get the 'a' tag
       * that is active (tag contains 'is-active' in its classes),
       * and get its values to be displayed in the modal.
       */
      let links = document.getElementsByTagName("a");
      let values;
      for(let i = 0; i < links.length; i++) {
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
    /*
     * Open modal by adding 'is-active' to its classlist 
     */
    let isActive = document.getElementById("addcart").classList.toggle('is-active');
    if(isActive) {
      this.setState({
        sku: name[0],
        price: name[1]
      });
    }
  }

  /*
   * Function: getFormValue 
   * Parameter/s: string (type STRING)
   * Description: With a parameter 'string' that contains
   * the form of the molecule, this function returns the
   * score of the form in order to know the hierarchy of
   * sorting the items by form.
   */

  getFormValue(string) {
    let value = 0;
    switch(string) {
      case 'Tablet':
        value = 7;
        break;
      case 'Capsule':
        value = 6;
        break;
      case 'Syrup':
        value = 5;
        break;
      case 'Suspension':
        value = 4;
        break;
      case 'Drops':
        value = 3;
        break;
      case 'Gel':
        value = 2;
        break;
      case 'Lotion':
        value = 1;
        break;
      default:
        value = 0;
        break;
    }
    return value;
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
      /*
       * Reverts the item.tags variable into a string
       * separated by the pipe ( | ) character 
       */
      if(typeof item.tags !== 'string') {
        item.tags = item.tags.join('|');
      }
      /*
       * Separate the tags into an array, where initially,
       * the tags are in a string delimited by a pipe ( | )
       */
      let willReturn = false;
      item.tags = item.tags.split('|');
      for(let i = 0; i < item.tags.length; i++) {
        let tag = item.tags[i];
        /*
         * If input string matches at least one of the tags 
         * (input as a substring/whole string), return the item 
         */
        if(tag.toLowerCase().indexOf(input) !== -1) {
          willReturn = true;
          break;
        }
      }
      return willReturn;
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
        /*
         * Replace molecule and brand fields that contain the
         * <b> tags into an empty string. 
         */
        item.molecule = item.molecule.replace('<b>', '');
        item.molecule = item.molecule.replace('</b>', '');
        item.brand = item.brand.replace('<b>', '');
        item.brand = item.brand.replace('</b>', '');
      }
      if(item.form === null) {
        item.form = item.sku;
      }
      /*
       * Get the index of the substring matched by the input string
       * to the resulting string, and store it in a new item attribute,
       * index_of. 
       */
      item['index_of'] = item.molecule.toLowerCase().indexOf(input);
      let value = item['index_of'] !== -1;
      if(value === true) {
        /*
         * If substring exists, get the substring in the result and
         * enclose it with <b> tags.
         */
        let substring = '';
        for(let x = item['index_of']; x <= item['index_of'] + input.length - 1; x++) {
          substring = substring + item.molecule[x];
        }
        item.molecule = item.molecule.replace(substring, '<b>'+substring+'</b>');
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
    let molecule = '';
    let previousValue = false;
    list = list.filter((item) => {
      /*
       * Get the index of the substring matched by the input string
       * to the resulting string, and store it in a new item attribute,
       * index_of. 
       */
      item['index_of'] = item.brand.toLowerCase().indexOf(input);
      let value = item['index_of'] !== -1;
      if(value) {
        /*
         * If certain item is to be returned, set the variable 'previousValue'
         * to true, which will be used later in whether a Value Brand item will
         * also be returned. 
         */
        previousValue = true;
        /*
         * If substring exists, get the substring in the result and
         * enclose it with <b> tags.
         */
        let substring = '';
        for(let x = item['index_of']; x <= item['index_of'] + input.length - 1; x++) {
          substring = substring + item.brand[x];
        }
        item.brand = item.brand.replace(substring, '<b>'+substring+'</b>');
      }
      if(molecule === '') {
        /*
         * Set the 'molecule' variable to the item's molecule.
         */
        molecule = item.molecule;
      }else {
        if(molecule !== item.molecule) {
          /*
           * Molecule being monitored has changed, set the 'molecule' 
           * variable to the new molecule detected, and set the
           * 'previousValue' variable to false.
           */
          molecule = item.molecule;
          previousValue = false;
        }else if(item.brand === 'Value Brand' && previousValue === true) {
          /*
           * Molecule being monitored is a Value Brand item,
           * and if previousValue is true, it means this item needs
           * to be returned as the Value Brand equivalent of a certain 
           * brand with the same molecule.
           * Set the 'value' variable to true (to return the item)
           */
          value = true;
          previousValue = false;
        } 
      }
      return value;
    });
    return list;
  }

  /*
   * Function: getLevDistance
   * Parameter/s: input (type STRING), resultString (type STRING)
   * Description: This function performs the algorithm to get the
   * Levenshtein Distance (LD) of two strings. LD is one metric 
   * used for the purposes of fuzzy search.
   */

  getLevDistance(input, resultString) {
    /*
     * Algorithm: 
     * 1. Set n as the length of the input string.
     * 2. Set m as the length of the item's brand/molecule
     * being compared with.
     */
    let n = resultString.length;
    let m = input.length;
    /*
     * 3. Initialize an 'n+1 x m+1' matrix.
     */
    let matrix = [];
    for(let x = 0; x <= n; x++) {
      matrix[x] = new Array(m+1);
    }
    /*
     * 4. Initialize the first row to 0..n. 
     */
    for(let x = 0; x <= n; x++) {
      matrix[x][0] = x;
    }
    /*
     *  5. Initialize the first column to 0..m 
     */
    for(let y = 0; y <= m; y++) {
      matrix[0][y] = y;
    }
    for(let x = 1; x <= n; x++) {
      let mChar = resultString[x-1].toLowerCase();
      for(let y = 1; y <= m; y++) {
        let sChar = input[y-1];
        /* 
         * 6. Compare the characters of resultString at index x-1
         * and input at index y-1, and if they are equal, initialize
         * a cost variable to 0. Otherwise, set it to 1.
         */
        let cost = 1;
        if(mChar === sChar) {
          cost = 0;
        }
        /*
         * 7. Set the value of the cell matrix[x][y] to the minimum of
         * the value of the cell to the left + 1 (matrix[x][y-1] + 1), 
         * the value of the cell above it + 1 (matrix[x-1][y] + 1), and 
         * the value of the cell diagonally above it (above, left) + the cost
         * (matrix[x-1][y-1] + cost).
         */
        matrix[x][y] = Math.min(matrix[x][y-1] + 1, matrix[x-1][y] + 1, matrix[x-1][y-1] + cost);
      }
    }
    /* 
     * 8. After computing the table, the final LD can
     * be found at the cell matrix[n][m].
     */
    let levenDist = matrix[n][m];
    /*
     * 9. Normalize the value of the LD to restrict the value 
     * from 0 to 1 by dividing the LD to the length of the 
     * longer string.
     */
    if(n >= m) {
      levenDist /= n;
    }else {
      levenDist /= m;
    }

    return levenDist;
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
        searchResults: [],
        empty: 3,
        isFuzzy: false
      });
      /* 
       * this.state.empty values:
       * 3: empty search input
       * 2: search unsuccessful
       * 1: search successful
       */
    } else {
      /*
       * Check if search input matches any molecule 
       */
      let itemList = this.state.jsonValues;
      let inputText = event.target.value.toLowerCase();
      itemList = this.getMolecule(itemList, inputText);
      if(itemList.length === 0) {
        /*
         * Input did not match any molecule,
         * search if it matches any brand
         */
        itemList = this.state.jsonValues;
        itemList = this.getBrand(itemList, inputText);
        if(itemList.length === 0) {
          /*
           * Input did not match any brand,
           * search if it matches any tag
           */
          itemList = this.state.jsonValues;
          itemList = this.getTags(itemList, inputText);
          if(itemList.length === 0) {
            /*
             * Input did not match any molecule, brand, or tag
             * Apply fuzzy search
             */
            itemList = this.state.jsonValues;
            itemList = itemList.filter((item) => {
              item.levenDist = this.getLevDistance(inputText, item.molecule);
              /* 
               * Fuzzy search on brand, update 
               * levenshtein distance if value is 
               * smaller than molecule's levenshtein
               * distance
               */
              let temp = this.getLevDistance(inputText, item.brand);
              if(temp < item.levenDist) {
                item.levenDist = temp;
              }
              return item;
            });
            /*
             * Sort fuzzy-searched items
             * Sorting Hierarchy: 
             * 1. Levenshtein Distance (ASCENDING)
             * 2. Molecule (A-Z)
             * 3. Form (based on getFormValue: Tablet, Capsule, Syrup, ...)
             */
            itemList = itemList.sort((a, b) => {
              if(a.levenDist - b.levenDist === 0) {
                let compareMolecule = a.molecule.localeCompare(b.molecule);
                if(compareMolecule === 0) {
                  let a_value = this.getFormValue(a.form);
                  let b_value = this.getFormValue(b.form);
                  return b_value - a_value;
                }
                return compareMolecule;
              }
              return a.levenDist - b.levenDist;
            });
            this.setState({
              isFuzzy: true
            });
          }else {
            this.setState({
              isFuzzy:false
            });
            /*
             * Search by tag successful,
             * sort filtered items 
             * Sorting Hierarchy:
             * 1. index_of (Where substring appears, ASCENDING)
             * 2. Molecule (A-Z)
             * 3. Form (based on getFormValue: Tablet, Capsule, Syrup, ...)
             * 4. Brand (Value Brand before anything else, then A-Z)
             */
            itemList = itemList.sort((a, b)=> {
              if(a.index_of === b.index_of) {
                let compareMolecule = a.molecule.localeCompare(b.molecule);
                if(compareMolecule === 0) {
                  let a_value = this.getFormValue(a.form);
                  let b_value = this.getFormValue(b.form);
                  let formResult = b_value - a_value;
                  if(formResult === 0) {
                    if(a.brand === 'Value Brand') {
                      return -100;
                    }else if(b.brand === 'Value Brand') {
                      return 100;
                    }
                    return a.brand.localeCompare(b.brand);
                  }
                  return formResult;
                }
                return compareMolecule;
              }
              return a.index_of - b.index_of;
            });
          }
        }else {
          this.setState({
            isFuzzy:false
          });
          /*
           * Search by brand successful,
           * sort filtered items 
           * Sorting Hierarchy:
           * 1. Molecule (A-Z)
           * 2. Form (based on getFormValue: Tablet, Capsule, Syrup, ...)
           * 3. Brand (A-Z)
           */
          itemList = itemList.sort((a,b) => {
            let compareMolecule = a.molecule.localeCompare(b.molecule);
            if(compareMolecule === 0) {
              let a_value = this.getFormValue(a.form);
              let b_value = this.getFormValue(b.form);
              let formResult = b_value - a_value;
              if(formResult === 0) {
                return a.brand.localeCompare(b.brand);
              }
              return formResult;
            }
            return compareMolecule;
          });
        }
      }else {
        this.setState({
          isFuzzy:false
        });
        /*
         * Search by molecule successful,
         * sort filtered items
         * 1. index_of (Where substring appears, ASCENDING)
         * 2. Molecule (A-Z)
         * 3. Form (based on getFormValue: Tablet, Capsule, Syrup, ...)
         * 4. Brand (Value Brand before anything else, then A-Z)
         */
        itemList = itemList.sort((a, b)=> {
          if(a.index_of === b.index_of) {
            let compareMolecule = a.molecule.localeCompare(b.molecule);
            if(compareMolecule === 0) {
              let a_value = this.getFormValue(a.form);
              let b_value = this.getFormValue(b.form);
              let formResult = b_value - a_value;
              if(formResult === 0) {
                if(a.brand === 'Value Brand') {
                  return -100;
                }else if(b.brand === 'Value Brand') {
                  return 100;
                }
                return a.brand.localeCompare(b.brand);
              }
              return formResult;
            }
            return compareMolecule;
          }
          return a.index_of - b.index_of;
        });
      }
      /*
       *  Get top 100 results 
       */
      if(itemList.length > 0) {
        let results = 0;
        itemList = itemList.filter((item) => {
          if(results === 100) {
            return false;
          }
          results++;
          return item;
        });
        this.setState({
          empty: 1,
          searchResults: itemList
        });
      }else {
        this.setState({
          empty: 2,
          searchResults: itemList
        }); 
      }
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
    /*
     * Fetch data from endpoint and store the data into a state variable 
     */
    axios.get('https://medgrocer.com/mg/products').then(response => { 
      this.setState({loading:false, jsonValues: response.data, searchResults: []}); 
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
    let select;
    switch(event.keyCode) {
      default:
        break;
      case 13: 
        /*
         * ENTER key 
         * Open the modal when an item is selected
         */
        this.openModal();
        break;
      case 38:
        /*
         * Arrow Up key
         * Navigate through list going up 
         */
        let index;
        select = document.getElementsByTagName('a');
        for(let i = 0; i < select.length; i++) {
          if(select[i].classList.contains('is-active')) {
            index = i;
            break;
          }
        }
        if(index > 0) {
          select[index].classList.remove('is-active');
          select[index-1].classList.add('is-active');
          select[index-1].scrollIntoView();
        }
        break;
      case 40: 
        /*
         * Arrow Down key 
         * Navigate through list going down
         */
        select = document.getElementsByTagName('a');
        for(let i = 0; i < select.length; i++) {
          if(select[i].classList.contains('is-active')) {
            index = i;
            break;
          }
        }
        if(index < select.length - 1) {
          select[index].classList.remove('is-active');
          select[index+1].classList.add('is-active');
          select[index+1].scrollIntoView();
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
    /*
     * Fetch data, add keydown events 
     */
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
        <Panel onChange={this.handleChange} isLoading={this.state.loading} isEmpty={this.state.empty} search={this.state.searchResults} clickModal={this.clickModal} isFuzzy={this.state.isFuzzy}/>
      </div>
    );
  }
}

export default Search;