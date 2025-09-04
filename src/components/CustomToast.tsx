import { CircleAlertIcon } from "lucide-react";

const CustomToast = ({ message }: { message: string }) => (
	<div className="flex gap-1 items-start space-x-2">
		<CircleAlertIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
		<span className="text-sm">{message}</span>
	</div>
);

export default CustomToast;
