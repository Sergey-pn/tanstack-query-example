import {Outlet} from '@tanstack/react-router'
import {Header} from "../../shared/ui/header/header.tsx";
import styles from "./root-layout.module.css"

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <div>Account</div>}/>
        <div className={styles.container}>
            <Outlet/>
        </div>
    </>
)