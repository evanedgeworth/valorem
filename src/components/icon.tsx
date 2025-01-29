import { PiClipboardTextFill } from "react-icons/pi";
import { TbEyeFilled } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { PiTrashFill } from "react-icons/pi";
import { MdNotifications } from "react-icons/md";
import Image from "next/image";
import Invoice from "../../public/icons/invoice.svg";
import Analytic from "../../public/icons/analytic.svg";
import PasswordHide from "../../public/icons/password-hide.svg";


export const ViewIcon = () => <PiClipboardTextFill size={16} />
export const DetailsIcon = () => <TbEyeFilled size={16} />
export const EditIcon = () => <FaUserEdit size={16} />
export const DeleteIcon = () => <PiTrashFill size={16} />
export const NotificationIcon = () => <MdNotifications size={28} />

export const InvoiceIcon = () => (
  <Image src={Invoice} alt="invoice" />
);

export const AnalyticIcon = () => (
  <Image src={Analytic} alt="analytic" />
);

