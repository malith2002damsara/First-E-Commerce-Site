
import PropTypes from 'prop-types';

const Title = ({text1,text2}) => {
  return (
    <div className='text-center mb-8'>
      <div className='inline-flex flex-col items-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>
          <span className='text-gray-600'>{text1}</span>
          <span className='text-black ml-2'>{text2}</span>
        </h2>
        <div className='w-16 h-1 bg-black rounded-full'></div>
      </div>
    </div>
  )
}

Title.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired
};

export default Title
