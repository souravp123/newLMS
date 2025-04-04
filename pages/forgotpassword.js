import React from 'react'
import ForgotPasswordForm from '@/components/Authentication/ForgotPasswordForm'
import Navbar from '@/components/_App/Navbar'
import Footer from '@/components/_App/Footer'
 
const forgotpassword = ({user}) => {
  return (
    <div>
        <Navbar user={user} />

            <ForgotPasswordForm />
            
        <Footer user={user}/>

    </div>
  )
}

export default forgotpassword