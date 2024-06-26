import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { ethers, providers } from "ethers";
import GiftIcon from "@heroicons/react/outline/GiftIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";
import { USDCX_ABI } from "../../constants";
import { useAccount } from "@thirdweb-dev/react";
type Props = {
  isOpen: boolean;
  setIsOpen: (boolean) => void;
  toAddress:string;
  toUser:string;
};

const SendTip = ({ isOpen, setIsOpen,toAddress,toUser }: Props) => {
  const [tipAmount, setTipAmount] = React.useState<any>(0.0);
  const [maticPrice, setMaticPrice] = React.useState<any>(0.0);
  const address = useAccount();
  const {sendTip} = useSuperstreamContract();
  const getMaticPrice = async (): Promise<void> => {
    try {
      const provider = ethers.providers.getDefaultProvider(
        "https://opbnb-testnet.publicnode.com"
      );
     
      const contractAddress = "0x371907DA46F9771189C068864115a4e84a227469";
      const priceFeed = new ethers.Contract(
        contractAddress,
        USDCX_ABI,
        provider
      );
      
      let balance = await priceFeed.balanceOf("0xcfa038455b54714821f291814071161c9870B891");
      balance = ethers.utils.formatUnits(balance, 18);
      console.log(balance);
      setMaticPrice(balance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTip = async () => {
    await sendTip(toAddress,tipAmount);
  }

  React.useEffect(() => {
    getMaticPrice();
  }, []);
  const closeModal = () => setIsOpen(false);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-2xl mb-4 font-display font-medium leading-6 text-gray-100"
              >
                Send Tip to {toUser}
              </Dialog.Title>
              <p className="text-sm text-gray-400  font-display">Receiver's Address : {toAddress} </p>
              <div className="mt-4 flex flex-col">
                <label className="mb-2 italic  font-medium text-gray-300 text-sm">
                  Tip Amount in opBNB
                </label>
                <input
                  type="number"
                  min="0.01"
                  step={0.1}
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                />
                <div className="flex gap-2 items-center my-4">
                  <p className="text-gray-300 font-display max-w-fit font-medium bg-gray-700 p-1 px-3 rounded-xl">
                  Balance = USDCX <span className="text-green-400">{maticPrice}</span>
                  </p>
                  <p className="text-violet-300 bg-violet-900 font-display bg-opacity-50 font-medium  ring-1 ring-violet-400  p-1 px-3 rounded-xl">
                   Tip : {tipAmount} OPBNB ( $ {(maticPrice * tipAmount).toFixed(2)} )
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleSendTip} className="w-full py-2  rounded-xl justify-center bg-emerald-500 group hover:bg-emerald-400">
                  <GiftIcon className="h-6 w-6 mr-2 group-hover:scale-110  group-hover:rotate-6" />
                  Send Tip
                </button>
                <button
                  onClick={closeModal}
                  className="w-full bg-rose-500 justify-center rounded-xl hover:bg-rose-400 active:bg-rose-600"
                >
                  <XIcon className="h-6 w-6 mr-2 group-hover:scale-110" /> Cancel{" "}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SendTip;
