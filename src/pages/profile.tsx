import type { NextPageWithLayout } from './_app';
import { PrimaryLayout } from '@/layouts';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import Head from 'next/head';

declare global {
  interface Window {
    cloudinary: any;
  }
}

const Profile: NextPageWithLayout = () => {
  const { t } = useTranslation('header'); // Reuse header translations or create new
  const { data: session, status, update } = useSession(); // update function to refresh session
  const router = useRouter();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      // Reload session to reflect changes
      await update();
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      alert(`Error updating profile: ${error.message}`);
    }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session, status, router]);

  const handleUpload = () => {
    if (window.cloudinary) {
      setIsUploading(true);
      window.cloudinary.openUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'kara-shop-avatar', 
          sources: ['local', 'url', 'camera'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false, 
          folder: 'avatars',
          singleUploadAutoClose: false, // Prevent auto close after upload
        },
        (error: any, result: any) => {
          if (result && result.event) {
            console.log('Cloudinary Event:', result.event, result.info);
          }

          if (!error && result && result.event === 'success') {
            console.log('Upload success:', result.info);
            
            let imageUrl = result.info.secure_url;
            // Check if there are cropping coordinates
            if (result.info.coordinates && result.info.coordinates.custom && result.info.coordinates.custom[0]) {
               const [x, y, w, h] = result.info.coordinates.custom[0];
               // Inject crop transformation into the URL
               // Example: .../upload/v123/... -> .../upload/x_100,y_100,w_200,h_200,c_crop/v123/...
               const parts = imageUrl.split('/upload/');
               if (parts.length === 2) {
                   imageUrl = `${parts[0]}/upload/x_${x},y_${y},w_${w},h_${h},c_crop/${parts[1]}`;
               }
            }

            setImage(imageUrl);
            setIsUploading(false);
            // Optionally close widget here if we have reference, but let user close or logic handle it
            // widget.close(); // We don't have widget ref easy access here unless we store it.
          }
           if (error) {
              console.error('Cloudinary Error:', error);
              setIsUploading(false);
          }
        }
      );
    } else {
        alert("Cloudinary SDK not loaded");
    }
  };

  const handleSave = () => {
    updateProfile.mutate({ name, image });
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <>
    <Head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
    </Head>
    <div className="container mx-auto mt-10 max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
      
      <div className="bg-white p-6 shadow rounded-lg">
        {/* Avatar Section */}
        <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
                {image ? (
                    <Image src={image} alt="Profile" fill className="object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50"
            >
                {isUploading ? 'Uploading...' : 'Change Avatar'}
            </button>
        </div>

        {/* Name Section */}
        <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Display Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-violet-500"
            />
        </div>

        {/* Email Section (Read-only) */}
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input 
                type="text" 
                value={session?.user?.email || ''} 
                disabled 
                className="w-full cursor-not-allowed rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
            />
        </div>

        {/* Save Button */}
        <button 
            onClick={handleSave}
            disabled={updateProfile.isLoading}
            className="w-full rounded bg-black py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
            {updateProfile.isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
    </>
  );
};

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'My Profile',
        description: 'Manage your profile',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default Profile;
