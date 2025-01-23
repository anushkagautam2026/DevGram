import { Link } from 'react-router-dom';
import { Button, TextInput,Alert,Modal, ModalBody } from 'flowbite-react';
import { useRef, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure ,deleteUserStart,deleteUserSuccess,deleteUserFailure,
  updateStart,updateSuccess,updateFailure,signoutSuccess} from '../redux/user/userSlice';
export default function DashProfile() {
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const { currentUser ,error} = useSelector((state) => state.user);
  const [imageFileURL, setImageFileURL] = useState(currentUser?.profilePicture);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData,setFormData]=useState({});
  const filePickerRef = useRef();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      //setImageFileURL(URL.createObjectURL(file)); // Show preview
      await uploadImage(file); // Upload the image
    }
  };
  const uploadImage = async (file) => {
    if (!file) return;

    setUploading(true);
    const formDataPP = new FormData();
    formDataPP.append('file', file);
    formDataPP.append('upload_preset', 'DevGram'); // Replace with your Cloudinary preset

    try {
      // Dispatch signInStart to show loading state
      dispatch(signInStart());

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/drgj9mmoh/image/upload', // Cloudinary API endpoint
        {
          method: 'POST',
          body: formDataPP,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        // Send the updated profile picture URL to the backend
        const updateResponse = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.access_token}`,
          },
          body: JSON.stringify({ profilePicture: data.secure_url }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update profile picture');
        }

        //Update Redux state with the new user data
        const updatedUser = {
          ...currentUser,
          profilePicture: data.secure_url, // Update with the new profile picture
        };
        dispatch(signInSuccess(updatedUser));
        setFormData({ ... formData, profilePicture: data.secure_url});
        alert('Profile picture updated successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(signInFailure(error.message)); // Dispatch failure action
      alert('An error occurred while updating the profile picture.');
    } finally {
      setUploading(false);
    }
  };
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    // Skip if no data to update
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
  
    try {
      dispatch(updateStart());
  
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.access_token}`, // Include token if required
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        dispatch(updateUserError(data.message)); // Dispatch failure action
        setUpdateUserError(data.message);
        return;
      }
  
      // Dispatch success action and notify user
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully");
    } catch (error) {
      dispatch(updateFailure(error.message)); // Dispatch failure action
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">PROFILE</h1>
      <form onSubmit={handleSubmit}className="flex flex-col gap-4">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        {/* Profile Picture */}
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileURL || currentUser?.profilePicture || '/default-avatar.png'} // Fallback to default avatar
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>

        {/* Loading Indicator */}
        {uploading && <p className="text-center text-sm text-gray-500">Uploading...</p>}

        {/* Form Inputs */}
        <TextInput
          type="text"
          id="username"
          placeholder="username" onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email" onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <TextInput type="text" id="password" placeholder="password" onChange={handleChange} />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {/* Footer Options */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=>setShowModal(true)}className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout}className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
