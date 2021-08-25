let url = `http://localhost:5000`;
if (process.env.NODE_ENV === 'production') url = 'https://ades-ca2-demo.herokuapp.com';

export const host = url;
