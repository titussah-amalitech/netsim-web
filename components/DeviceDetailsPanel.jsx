const DeviceDetailsPanel = ({device, message, time, indication, date, colorMode}) => {

  let indColor
    if(indication === 'High'){
        indColor = 'rgb(239 68 68)'
    }else if(indication === 'Medium'){
        indColor = 'rgb(245 158 11)'
    }else{
        indColor = 'rgb(16 185 129)'
  }
  return (
    <div className='flex details-panel p-4' >
        <div className='w-1/3 rounded-xl p-4' style={{backgroundColor: colorMode.gray}}>
            <div className="flex items-center ">
                <div className='w-30 h-30 rounded-full overflow-hidden'>
                    <img src="/images/cloud-server.png" alt="web server image" />
                </div>
                <p className='text-2xl ms-3 font-black text-nowrap' style={{color: colorMode.text}}>Web Server</p>
                <img src="/images/verify.png" alt="verify icon" height={24} width={24} className='verify ms-2  rounded-full'/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-2xl text-nowrap' style={{color: colorMode.text}}>Ping rate</p>
                <input type="text" value={"30s"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: colorMode.background, color: 'rgb(245 158 11)'}} disabled/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-2xl' style={{color: colorMode.text}}>Latency</p>
                <input type="text" value={"250ms"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: colorMode.background, color: 'rgb(16 185 129)'}} disabled/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-2xl text-nowrap' style={{color: colorMode.text}}>Error probability</p>
                <input type="text" value={"0.8"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: colorMode.background, color: 'rgb(239 68 68)'}} disabled/>
            </div>
        </div>
        <div className='flex flex-row ms-2 overflow-auto w-2/3 p-4 rounded-xl max-h-80' style={{backgroundColor: colorMode.gray}}>
            <div className="log border-l-4 rounded-xl flex w-max  p-4 my-4 flex-1 h-max" style={{ backgroundColor: colorMode.background}}>
                <div className="me-4 h-5 w-5 rounded-full mt-1" style={{backgroundColor: indColor}}>
                
                </div>
                <div className="w-full">
                    <div className="flex">
                        <p className="font-extrabold mt-1"  style={{color: colorMode.text}}>{device}</p>
                        <p className="indicator ms-5 rounded-sm font-bold " style={{color: indColor}}>{indication}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 text-nowrap" style={{color: colorMode.text}}>{message}</p>
                    <p className="text-gray-400 text-xs mt-1" style={{color: colorMode.text}}>{date}, {time}</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default DeviceDetailsPanel