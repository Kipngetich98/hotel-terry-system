import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import logger from '../utils/logger';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

interface MenuItemImageUploadProps {
  menuItemId: number;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
}

const MenuItemImageUpload: React.FC<MenuItemImageUploadProps> = ({
  menuItemId,
  currentImageUrl,
  onImageUploaded
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrorMessage('Please select an image file (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 2MB');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      setTimeout(() => {
        const mockImageUrl = URL.createObjectURL(file);
        
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const updatedItems = menuItems.map((item: any) => {
          if (item.id === menuItemId) {
            return { ...item, imageUrl: mockImageUrl };
          }
          return item;
        });
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        
        onImageUploaded(mockImageUrl);
        setIsUploading(false);
        
        logger.info('Menu item image uploaded', { menuItemId, imageUrl: mockImageUrl });
      }, 1500);
    } catch (error) {
      setIsUploading(false);
      setErrorMessage('Failed to upload image. Please try again.');
      
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.SYSTEM,
          userMessage: 'Failed to upload menu item image'
        }
      );
    }
  };

  return (
    <div className="menu-item-image-upload">
      <div className="mb-4">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Menu item preview" 
              className="w-full h-48 object-cover rounded-md"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-48 bg-gray-50">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>
      
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
      
      {isUploading && (
        <div className="flex items-center justify-center mt-2">
          <svg className="animate-spin h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default MenuItemImageUpload;
