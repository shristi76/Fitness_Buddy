import Header from "../components/Header";
import Hero from "../components/Hero";
// import About from "../components/About";
import FitnessForm from "../components/FitnessForm";
import Footer from "../components/Footer";

function Home({ onSignOut }) {
    return (
        <>
            <Header onSignOut={onSignOut} />
            <Hero />
            {/* <About /> */}
            <FitnessForm />
            <Footer />
        </>
    );
}

export default Home;
