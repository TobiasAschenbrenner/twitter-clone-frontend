import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";

const Container = ({ children }) => {
    return (
        <div className="Page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Header />
            <div class="content">
                <Sidebar />
                <div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Container;