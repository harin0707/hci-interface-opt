import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
        <Component {...pageProps} />
        </RecoilRoot>
    );
    }
