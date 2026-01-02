import styles from "./Loader.module.css";

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-[91.5vh]">
            <span className={styles.loader}></span>
        </div>
    )
}