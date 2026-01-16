
import Navbar from "@/components/Navbar"
import ModalCampanhas from "@/components/ModalCampanhas";

export default function Reports() {
    return (

        <section className="w-full h-full">

            <div className="w-full! h-auto! relative! flex justify-center! items-center">
                <Navbar />
            </div>

            <div className="w-full h-auto mt-20! px-10! py-5!">
                <ModalCampanhas />
            </div>

        </section>
    )
}