import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit';

// Have a function to enter the lottery.

export default function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);

	// console.log(chainId);
	// console.log(contractAddresses);

	const raffleAddress = contractAddresses[chainId][0];
	const [entranceFee, setEntranceFee] = useState('0');
	const [numPlayers, setNumPlayers] = useState('0');
	const [recentWinner, setRecentWinner] = useState('0');

	const dispatch = useNotification();

	// console.log(raffleAddress);

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'getEntranceFee',
		params: {},
	});

	const {
		runContractFunction: enterRaffle,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'enterRaffle',
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'getNumberOfPlayers',
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'getRecentWinner',
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = await getEntranceFee();
		const numPlayersFromCall = await getNumberOfPlayers();
		const recentWinnerFromCall = await getRecentWinner();
		setEntranceFee(entranceFeeFromCall.toString());
		setNumPlayers(numPlayersFromCall.toString());
		setRecentWinner(recentWinnerFromCall.toString());
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	useEffect(() => {
		updateUI();
	}, [recentWinner]);

	// console.log(entranceFee);

	const handleSuccess = async (tx) => {
		await tx.wait(1);
		handleNewNotification(tx);
		updateUI();
	};

	const handleNewNotification = () => {
		dispatch({
			type: 'info',
			message: 'Transaction Complete',
			title: 'Tx Notification',
			position: 'topR',
			icon: 'bell',
		});
	};

	return (
		<div className="p-5">
			<h1 className="py-4 px-4 font-bold text-3xl">Enter the lottery</h1>
			{raffleAddress ? (
				<div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
						onClick={async () => {
							await enterRaffle({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							});
						}}
						disabled={isLoading || isFetching}
					>
						{isLoading || isFetching ? (
							<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
						) : (
							'Enter Raffle'
						)}
					</button>
					<hr className="my-4" />
					Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
					<hr className="my-4" />
					Number of Players: {numPlayers}
					<hr className="my-4" />
					RecentWinner: {recentWinner}
				</div>
			) : (
				<div>No Raffle address detected!</div>
			)}
		</div>
	);
}
