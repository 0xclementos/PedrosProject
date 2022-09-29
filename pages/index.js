import Footer from "../components/Footer";
import Header from "../components/Header";
import MintControls from "../components/MintControls";
import { AppContext } from "../context";
import { useContext } from "react";
import Head from 'next/head'

export default function Home() {

  const { walletConnected, walletAddress, connectWallet } =
    useContext(AppContext);

  return (
    <>
      <Head>
        <title>The Final Journey</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <main className="flex items-center justify-center flex-col h-screen w-screen p-10">
        <h1 className="lg:text-6xl text-2xl mb-7 z-50 text-center leading-[2] lg:leading-[2]">
        Do You Want To Embark On The Final Journey?
        </h1>
        {walletConnected ? (
          <button className={styles.button}>{walletAddress}</button>
        ) : (
          <button className={styles.button} onClick={connectWallet}>
            Connect wallet
          </button>
        )}
        <MintControls />
      </main>
      <Footer />
    </>
  );
}

const styles = {
  button: `lg:text-2xl border-none backdrop-blur-sm bg-[#ffffff49] text-[#fff] active:scale-90 transition text-[12px] p-3 py-2 rounded-md cursor-pointer select-none mb-10`,
};