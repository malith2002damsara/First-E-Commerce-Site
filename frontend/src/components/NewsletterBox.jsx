

const NewsletterBox = () => {

const onSubmitHandler= (event) =>{
  event.preventDefault();

}

  return (
    <div className='text-center px-5'>
      <p className='text-2xl font-medium text-gray-800'>SUBSCRIBE NOW & GET 20% OFF</p>
      {/* <p className='text-gray-400 mt-3'>
        my name is malith damsara and i&apos;m 22 yeras old
      </p> */}
      <form onSubmit={onSubmitHandler}  className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="emai" placeholder='Enter your E-mail' required/>
        <button type = 'submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
      
    </div>
  )
}

export default NewsletterBox
