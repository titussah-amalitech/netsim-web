const DeviceDetailsPanel = ({device, message, time, indication, date}) => {

  let indColor
    if(indication === 'High'){
        indColor = 'rgb(239 68 68)'
    }else if(indication === 'Medium'){
        indColor = 'rgb(245 158 11)'
    }else{
        indColor = 'rgb(16 185 129)'
  }
  return (
    <div className='flex details-panel p-4'>
        <div className='w-1/3 bg-gray-700 rounded-xl p-4'>
            <div className="flex items-center ">
                <div className='w-30 h-30 rounded-full overflow-hidden'>
                    <img src="/images/cloud-server.png" alt="web server image" />
                </div>
                <p className='text-white text-2xl ms-3 font-black text-nowrap'>Web Server</p>
                <img src="/images/verify.png" alt="verify icon" height={24} width={24} className='verify ms-2  rounded-full'/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-white text-2xl text-nowrap'>Ping rate</p>
                <input type="text" value={"7"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: '#0f172a', color: 'rgb(245 158 11)'}} disabled/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-white text-2xl'>Latency</p>
                <input type="text" value={"4"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: '#0f172a', color: 'rgb(16 185 129)'}} disabled/>
            </div>
            <div className="flex justify-between my-2 ms-2">
                <p className='text-white text-2xl text-nowrap'>Error probability</p>
                <input type="text" value={"0.8"} className='text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl' style={{backgroundColor: '#0f172a', color: 'rgb(239 68 68)'}} disabled/>
            </div>
        </div>
        <div className='ms-2 overflow-auto bg-gray-700 w-2/3 p-4 rounded-xl max-h-80'>
            <div className="log border-l-4 rounded-xl flex w-max  p-4 my-4 w-full" style={{ backgroundColor: 'rgb(15 23 42)'}}>
                <div className="me-4 h-5 w-5 rounded-full mt-1" style={{backgroundColor: indColor}}>
                
                </div>
                <div className="w-3/4">
                    <div className="flex">
                        <p className="text-white font-extrabold mt-1">{device}</p>
                        <p className="indicator text-white ms-5 rounded-sm font-bold " style={{color: indColor}}>{indication}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 text-nowrap">{message}</p>
                    <p className="text-gray-400 text-xs mt-1">{date}, {time}</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default DeviceDetailsPanel