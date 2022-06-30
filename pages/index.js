import Head from 'next/head';
import styles from '../styles/Home.module.css';
// import ManualHeader from '../components/ManualHeader';
import Header from '../components/Header';
import LotteryEntrance from '../components/LotteryEntrance';
import { useMoralis } from 'react-moralis';

const supportedChains = ['31337', '4'];

export default function Home() {
	const { isWeb3Enabled, chainId } = useMoralis();

	return (
		<div className={styles.container}>
			<Head>
				<title>Lottery DApp</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{/* <ManualHeader /> */}
				<Header />
				{isWeb3Enabled ? (
					<div>
						{supportedChains.includes(parseInt(chainId).toString()) ? (
							<div className="flex flex-row">
								<LotteryEntrance className="p-8" />
							</div>
						) : (
							<div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
						)}
					</div>
				) : (
					<div>Please connect to a Wallet</div>
				)}
			</main>

			<footer className={styles.footer}></footer>
		</div>
	);
}
