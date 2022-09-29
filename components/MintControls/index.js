import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "../../context";

const MintControls = () => {
  const {
    numOfNft,
    increaseNumOfNft,
    decreaseNumOfNft,
    toggleBtnClick,
    btnClicked,
    walletConnected,
    loading,
    mintPrice
  } = useContext(AppContext);

  if (walletConnected)
    return (
      <>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="text-center flex flex-col items-center">
            <h3 className="z-50 lg:text-2xl">Quantity:</h3>
            <div className="flex items-center mt-5 z-50 select-none">
              <div className={styles.caret} onClick={decreaseNumOfNft}>
                <Image
                  src="/assets/svg/caret-left.svg"
                  width="30"
                  height="30"
                  alt="caret left"
                />
              </div>
              <h2 className="text-2 lg:text-2xl mx-4">{numOfNft}</h2>
              <div className={styles.caret} onClick={increaseNumOfNft}>
                <Image
                  src="/assets/svg/caret-right.svg"
                  width="30"
                  height="30"
                  alt="caret left"
                />
              </div>
            </div>

            { mintPrice > 0 && <div
              className="mint-btn -mt-10 lg:-mt-20 scale-150 cursor-pointer select-none"
              onClick={toggleBtnClick}
            >
              {btnClicked ? (
                <Image
                  src="/assets/btn-animated.gif"
                  width="430"
                  height="230"
                  alt="Mint button"
                />
              ) : (
                <Image
                  src="/assets/btn-clicked.gif"
                  width="430"
                  height="230"
                  alt="Mint button"
                />
              )}
            </div> }
            
          </div>
        )}
      </>
    );

  return <></>;
};

const styles = {
  caret: `border-2 rounded-full w-[35px] h-[35px] cursor-pointer hover:opacity-70 transition active:scale-90 select-none`,
};

export default MintControls;
