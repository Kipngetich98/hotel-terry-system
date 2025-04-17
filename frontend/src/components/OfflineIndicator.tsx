import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setOfflineStatus } from '../store/slices/uiSlice';

const OfflineIndicator: React.FC = () => {
  const dispatch = useDispatch();
  const { isOffline } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const handleStatusChange = () => {
      dispatch(setOfflineStatus(!navigator.onLine));
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    handleStatusChange();

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [dispatch]);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="offline-indicator">
      You are currently offline. Some features may be limited.
    </div>
  );
};

export default OfflineIndicator;
