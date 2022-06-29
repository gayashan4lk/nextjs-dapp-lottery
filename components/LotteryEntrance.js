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

	const dispatch = useNotification();

	// console.log(raffleAddress);

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'getEntranceFee',
		params: {},
	});

	useEffect(() => {
		if (isWeb3Enabled) {
			async function updateUI() {
				const entranceFeeFromCall = await getEntranceFee();
				setEntranceFee(entranceFeeFromCall.toString());
				console.log(entranceFee);
			}
			updateUI();
		}
	}, [isWeb3Enabled]);

	// console.log(entranceFee);

	const { runContractFunction: enterLottery } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: 'enterRaffle',
		params: {},
		msgValue: entranceFee,
	});

	const handleSuccess = async (tx) => {
		await tx.wait(1);
		handleNewNotification(tx);
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
		<div>
			{raffleAddress ? (
				<div>
					<button
						onClick={async () => {
							await enterLottery({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							});
						}}
					>
						Enter Raffle
					</button>
					Entrance Fee : {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
				</div>
			) : (
				<div>No Raffle address detected!</div>
			)}
		</div>
	);
}
