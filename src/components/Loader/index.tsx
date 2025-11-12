import styles from "./Loader.module.css";

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-[91.5vh] bg-gray-300">
            <span className={styles.loader}></span>
        </div>
    )
}