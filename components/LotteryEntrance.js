import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Have a function to enter the lottery.

export default function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);

	// console.log(chainId);
	// console.log(contractAddresses);

	const raffleAddress = contractAddresses[chainId][0];
	const [entranceFee, setEntranceFee] = useState('0');

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
				setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall.toString(), 'ether'));
				console.log(entranceFee);
			}
			updateUI();
		}
	}, [isWeb3Enabled]);

	// console.log(entranceFee);

	// const {runContractFunction: enterLottery} = useWeb3Contract({
	//   abi: abi,
	//   contractAddress: raffleAddress,
	//   functionName: 'enterRaffle',
	//   params: {},
	//   msgValue: ,
	// });

	return <div>Entrance Fee : {entranceFee} ETH</div>;
}
