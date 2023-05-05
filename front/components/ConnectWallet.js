import { NetworkErrorMessage } from "./NetworkErrorMessage"
import styles from "./ConnectWallet.module.css";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <>
      <div>
        {networkError && (
          <NetworkErrorMessage 
            message={networkError} 
            dismiss={dismiss} 
          />
        )}
      </div>

      <p className={styles.buttonWallet}>Please connect your account...</p>
      <button className={styles.wallet} type="button" onClick={connectWallet}>
        Connect Wallet
      </button>
    </>
  )
}
