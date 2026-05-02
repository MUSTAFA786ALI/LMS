/**
 * Custom Hook: useNetworkStatus
 * Monitors network connectivity
 */

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export interface NetworkState {
  isConnected: boolean | null;
  isWifiEnabled: boolean | null;
  type: string | null;
}

export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isWifiEnabled: null,
    type: null,
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        isWifiEnabled: state.type === 'wifi',
        type: state.type || null,
      });
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        isWifiEnabled: state.type === 'wifi',
        type: state.type || null,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline: networkState.isConnected === true,
    isOffline: networkState.isConnected === false,
    isConnected: networkState.isConnected,
    isWifi: networkState.isWifiEnabled,
    networkType: networkState.type,
  };
}

export default useNetworkStatus;
