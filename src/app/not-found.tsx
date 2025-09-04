import Link from "next/link";
import React from "react";

const notFound = () => {
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="text-center">
				<div className="text-8xl font-bold text-slate-300 mb-4">404</div>
				<h1 className="text-4xl font-bold text-slate-800 mb-2">
					Oops! Page Not Found
				</h1>
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				<Link
					href="/"
					className="bg-black/90 hover:bg-black/95 text-white py-3 px-8 rounded-lg font-semibold transition-colors duration-200 text-center"
				>
					← Back to Portfolio
				</Link>
			</div>
		</div>
	);
};

export default notFound;
