import { configure } from 'enzyme';
import axios from 'axios';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Resolves issues with 'Error: Cross origin http://localhost forbidden'
axios.defaults.adapter = require('axios/lib/adapters/http');