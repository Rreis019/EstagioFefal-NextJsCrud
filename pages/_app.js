import '../styles/globals.css';
import "../styles/content-main.css";
import "../styles/sidebar.css";
import "../styles/header.css";
import "../styles/post.css";


import * as module from "./api/index.js";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
