/** 1.0.0 | www.phoxer.com */
import { useCallback } from "react";

type TSessionStorage =  Storage | null;

const useSessionStorage = (): TSessionStorage => {

    const sessionStorage = useCallback((): TSessionStorage => {
        if (typeof window === 'undefined') {
            console.warn("SessionStorage is Not Available!.");
            return null;
        }
    
        try {
          return window.sessionStorage;
        } catch (error) {
          console.warn(`Error reading SessionStorage`, error);
          return null;
        }
    }, []);

    return sessionStorage();
}

export default useSessionStorage;