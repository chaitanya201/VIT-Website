import React from 'react'

export default function ShowStudents({student}) {
  return (
    <div className='flex'>
        <div>
            {student.name}
        </div>
        <div>
            {student.email}
        </div>
    </div>
  )
}
