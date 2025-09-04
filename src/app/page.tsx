import Portfolio from "@/components/Portfolio";

export default function Home() {
	return (
		<div className="font-sans">
			<main className="">
				<Portfolio />
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
		</div>
	);
}
