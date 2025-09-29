
const DeviceLogger = ({device, message, time, indication, date}) => {

    let indColor
    if(indication === 'High'){
        indColor = 'rgb(239 68 68)'
    }else if(indication === 'Medium'){
        indColor = 'rgb(245 158 11)'
    }else{
        indColor = 'rgb(16 185 129)'
    }
    return (
        <div className="log border-l-4 max-w-150 rounded-xl flex  p-4 my-4 w-full" style={{ backgroundColor: 'rgb(15 23 42)'}}>
            <div className="me-4 h-5 w-5 rounded-full mt-1" style={{backgroundColor: indColor}}>
                
            </div>
            <div className="w-3/4">
                <div className="flex">
                    <p className="text-white font-extrabold mt-1">{device}</p>
                    <p className="indicator text-white ms-5 rounded-sm font-bold" style={{color: indColor}}>{indication}</p>
                </div>
                <p className="text-gray-400 text-xs mt-2">{message}</p>
                <p className="text-gray-400 text-xs mt-1">{date}, {time}</p>
            </div>
        </div>
    )
}

export default DeviceLogger