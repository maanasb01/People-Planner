import { createContext, useContext, useEffect, useState } from "react";
import {
  Message,
  useToaster,
  ButtonToolbar,
  SelectPicker,
  Button,
} from "rsuite";
import SessionModal from "../components/SessionModal";

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [isSessionExModalOpen, setIsSessionExModalOpen] = useState(false);
  const toaster = useToaster();


  
  useEffect(() => {
    if (isLoading) {
      setIntervalId(
        setInterval(() => {
          setProgress(progress + 20);
        }, 300)
      );
    } else {
      setProgress(100);
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  function startLoading() {
    setIsLoading(true);
  }

  function stopLoading() {
    setIsLoading(false);
  }

  const fetchWithLoader = async (url, options) => {
    startLoading();
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        if(response.status===401){
          setIsSessionExModalOpen(true);
          return;
        }
        const data = await response.json();
        // setAlertMessage(data.message)
        showAlert(data.message);
        return ;
      }
      return response;
    } catch (error) {
      console.error('Error:', error);
      
      throw error; // Rethrow the error to be handled by the caller
    }  finally {
      stopLoading();
    }
  };
  
    function showAlert(msg) {
      const message = (
        <Message showIcon type={"error"} closable>
          <strong>Error!</strong> {msg || "Something Went Wrong."}
        </Message>
      );
      toaster.push(message, { placement: "topCenter", duration: 4000 });
    }


  return (
    <LoadingContext.Provider
      value={{
        progress,
        setProgress,
        startLoading,
        stopLoading,
        fetchWithLoader,
        isLoading,
        isSessionExModalOpen,
        setIsSessionExModalOpen
      }}
    >
      <SessionModal />
     
   
      {children}
    </LoadingContext.Provider>
  );
}
