import axios from 'axios';

export default axios.create({
  // Point this to your local backend
  baseURL: 'http://localhost:3000' 
});