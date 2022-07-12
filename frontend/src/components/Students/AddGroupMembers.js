import React, { useState } from 'react'

export default function AddGroupMembers({setGroupMembersEmail, groupMembersEmail}) {
    const [email, setEmail] = useState('');
    console.log("email",email);
  return (
    <div>
        <div>
            <input type="email" placeholder='Enter team mates email' required onChange={(e) => {
                console.log("changed")
                setEmail(e.target.value)
                
            }} />
            <div><button onClick={() => {
                if(!groupMembersEmail.includes(email)) {
                    setGroupMembersEmail((oldEmail) => [...oldEmail, email])
                }
            }}>Done</button></div>
        </div>
    </div>
  )
}
