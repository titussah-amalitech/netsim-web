
const DeviceStatusIndicator = ({device, message, time, indication, dismiss, index}) => {

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
        <div className="status  border-l-4 rounded-xl flex max-w-150 p-4 my-4 w-full" style={{ backgroundColor: bgColor, borderColor: indColor}}>
            <div className="me-4">
                <img src={indIcon} alt="Danger" height={32} width={32}/>
            </div>
            <div className="w-3/4">
                <div className="flex">
                    <p className="text-white font-extrabold mt-2">{device}</p>
                    <p className="indicator text-white ms-5 rounded-sm font-bold" style={{backgroundColor: indColor}}>{indication}</p>
                </div>
                <p className="text-gray-400 text-xs mt-2">{message}</p>
                <p className="text-gray-400 text-xs mt-1">{time}</p>
            </div>
            <div>
                <button className="dismiss text-gray-400 border rounded-sm font-bold ms-5" onClick={() => dismiss(index)}>Dismiss</button>
            </div>
        </div>
    )
}

export default DeviceStatusIndicator