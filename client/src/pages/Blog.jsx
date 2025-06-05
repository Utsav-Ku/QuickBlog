import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'

const Blog = () => {
  const {id} = useParams();

  const [data, setData] = useState(null);

  const fetchBlogData = async ()=>{
    const data =  blog_data.find(item => item._id === id);
    setData(data);
  }

  useEffect(() => {
    fetchBlogData();
  }, [])

  return data ?  (
    <div className='relative'>
      <img src={assets.gradientBackground} alt='gradientBackground' className='absolute -top-50 -z-1 opacity-50' />

      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2
          className="my-5 max-w-lg truncate mx-auto"
          dangerouslySetInnerHTML={{ __html: data.subTitle }}
        ></h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>Utsav Kumar</p>
      </div>

      <div></div>
    </div>
  ) : <div>Loading...</div>
}

export default Blog