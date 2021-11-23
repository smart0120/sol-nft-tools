import '../styles/globals.css';
import {Meta} from '../components/meta';
import { ModalProvider } from '../providers/modal-provider';

function MyApp({ Component, pageProps }) {
  return <>
    <Meta></Meta>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
  </>
}

export default MyApp
