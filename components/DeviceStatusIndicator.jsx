import { FaDeleteLeft } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { IoWarning } from "react-icons/io5";

const DeviceStatusIndicator = ({device, message, time, indication, dismiss, index, colorMode}) => {

    let bgColor, indColor, indIcon
    if(indication === 'High'){
        bgColor = 'rgb(239 68 68 / 0.1)'
        indColor = 'rgb(239 68 68)'
        indIcon = '/images/warning.png'
    }else if(indication === 'Medium'){
        bgColor = 'rgb(245 158 11 / 0.1)'
        indColor = 'rgb(245 158 11)'
        indIcon = '/images/warning-sign.png'
    }else{
        bgColor = 'rgb(16 185 129 / 0.1)'
        indColor = 'rgb(16 185 129)'
        indIcon = '/images/accept.png'
    }
    
    return (
        <div className="status   rounded-xl flex max-w-150 p-4 my-4 w-full justify-between" style={{ backgroundColor: colorMode.background}}>
            <div className="flex w-5/6 ">
                <div className="me-4">
                    {/* <img src={indIcon} alt="Danger" height={32} width={32}/> */}
                    {indication === 'High' ? <ImCross color="red" size={24}/> :
                    indication === 'Medium' ? <IoWarning color="orange" size={32}/> :
                    <TiTick color="green" size={36}/>}
                </div>
                <div className="w-3/4">
                    <div className="flex">
                        <p className="text-white font-extrabold mt-2" style={{color: colorMode.text}}>{device}</p>
                        <p className="indicator text-white ms-5 rounded-sm font-bold" style={{backgroundColor: indColor}}>{indication}</p>
                    </div>
                    <p className="text-xs mt-2" style={{color: colorMode.text}}>{message}</p>
                    <p className="text-xs mt-1" style={{color: colorMode.text}}>{time}</p>
                </div>
            </div>
            <div>
                <button className="dismiss rounded-sm font-bold ms-5" style={{color: colorMode.text}} onClick={() => dismiss(index)}>
                    <FaDeleteLeft color="gray" size={32}/>
                </button>
            </div>
        </div>
    )
}

export default DeviceStatusIndicator