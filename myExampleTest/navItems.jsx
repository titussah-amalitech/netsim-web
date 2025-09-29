import * as React from 'react';
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert';


const NavItems = () => {
  const [alet, setAlet] = React.useState(false)

  const showAlert = () => {
    setAlet(true)
    setTimeout(() => setAlet(false), 1500)
  }
  return (
    <div>
        <Button variant="contained" onClick={showAlert}>Hello world</Button>
        <Alert severity="success" style={{display: alet ? 'flex' : 'none', marginTop: '10px'}}>This is a success Alert.</Alert>
        {/* <Alert severity="info">This is an info Alert.</Alert>
        <Alert severity="warning">This is a warning Alert.</Alert>
        <Alert severity="error">This is an error Alert.</Alert> */}
    </div>
  )
}

export default NavItems