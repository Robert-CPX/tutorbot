import { ToastContainer } from 'react-toastify'

const Toast = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  )
}

export default Toast
