export const production = false; // set it to true when deploy to the server

const domain = production ? '159.89.194.49' : '127.0.0.1:3001';
export const websocketUrl = `ws://${domain}`
export const apiUrl = `http://${domain}`
export const apiUrlFb = `https://graph.facebook.com/v3.0`