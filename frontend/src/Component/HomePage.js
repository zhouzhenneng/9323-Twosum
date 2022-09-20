import React, {useState} from 'react'
import './HomePage.css'
import Album from './Album'

export default function HomePage() {
    const [company, setCompany] = useState('')
    const [mentor, setMentor] = useState('')

  return (
    <div className='container'>
        <Album/>
    </div>
  )
}
