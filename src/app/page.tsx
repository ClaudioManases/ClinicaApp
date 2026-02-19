import Header from "@/components/header";
import {BackgroundRippleEffect} from "@/components/background-ripple-effect";
import HomePage from "@/app/homePage";

export default function Page() {

    return (
        <div className="min-h-[calc(100vh-3.5rem)] mt-14 w-full relative">
            {/* Site Header */}
            <Header />

            {/* Background Ripple Effect */}
            <div className="absolute inset-0 z-0">
                <BackgroundRippleEffect />
            </div>

            {/* Content */}
            <div className="relative z-10  w-full p-6 mx-auto">
               <HomePage/>

            </div>
        </div>

    );
}
