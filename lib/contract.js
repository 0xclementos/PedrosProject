import { ethers } from "ethers";

export const convertToETH = (num) => {
  return ethers.utils.formatEther(num);
};

export const convertToBigNumber = (num) => {
  return ethers.utils.parseEther(num.toString());
};

export const weiToNumber = (num) => {
  return num.toNumber();
};
