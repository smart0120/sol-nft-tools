import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import {Meta} from '../components/meta';

function MyApp({ Component, pageProps }) {
  return <>
    <Meta></Meta>
    <Component {...pageProps} />
  </>
}

export default MyApp
