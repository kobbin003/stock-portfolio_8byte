import DisclaimerBanner from "@/components/DisclaimerBanner";
import FetchDataBtn from "@/components/FetchDataBtn";
import Portfolio from "@/components/Portfolio";
import { Slide, ToastContainer } from "react-toastify";

export default function Home() {
	return (
		<div className="font-sans">
			<main className="">
				<ToastContainer
					position="top-center"
					autoClose={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					theme="light"
					transition={Slide}
				/>
				<DisclaimerBanner />
				<Portfolio />
				{/* <FetchDataBtn /> */}
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
		</div>
	);
}
