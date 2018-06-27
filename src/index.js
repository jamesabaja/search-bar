
/*
 *  Modified Search Module for Medicines 
 *  http://search-bar.herokuapp.com
 *  James Gabriel Abaja
 *  Intern
 *  IT Team
 */

/*
 * Project Files Initial Creation Date: 6/19/18
 * Development Group: James Abaja
 * Client Group: MedGrocer IT Team
 * 
 * Most challenging aspects of the project:
 * 1. Matching the string input to the output (Emphasized substring in output)
 * 2. Finding the appropriate components to use for the display and output of data (both for the web and mobile side)
 * 3. Improving search performance and speed
 * 
 * Points for Improvement (Functional):
 * 1. User can put the molecule and brand in one entry (Search input: 'Paracetamol Biogesic')
 * 2. Better implementation of fuzzy search (Faster/Using a better algo)
 * 3. Input string that matches both molecule and brand must be displayed together (Current: Molecule -> Brand -> Tags -> Fuzzy Search)
 * 
 * Points for Improvement (Code):
 * 1. Break down parts of the code that can be turned into functions for reusability and improved code readability
 * 2. Rewrite variable names (and their declarations) into more meaningful ones 
 * 3. Reorganize/improve file structure of the project
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();