import ScrollToTopHandler from "../../utils/scrollTopHandler";
import Header from "./Header";
import MainContent from './MainContent';

export default function MainLayout() {
    return (
        <>
            <Header />
            <ScrollToTopHandler />
            <MainContent />
            {/* <Footer /> */}
        </>
    )
}