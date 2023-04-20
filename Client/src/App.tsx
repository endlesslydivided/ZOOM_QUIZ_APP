import zoomSdk from "@zoom/appssdk";
import { notification } from 'antd';
import { useEffect } from 'react';
import './App.scss';
import AppRouter from './components/AppRouter';
import { useLazyGetTokenQuery } from './services/AuthApiSlice';

const codeChallenge =  "chbDH4tbSj1MZu6-aI-pWPpTnIYNa9lQp8FuFnqemJs";
const state = "TIA5UgoMte";
const base64URL = (s:any) => s.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

function App() {

  const [getToken] = useLazyGetTokenQuery();
  
  const configAuth = async () => {
  
    const result = await zoomSdk.config({capabilities: ["getRunningContext","getSupportedJsApis","openUrl","authorize","onAuthorized"]})

    notification.info({message:JSON.stringify(result)});
    const challenge = base64URL(codeChallenge);

    zoomSdk.addEventListener("onAuthorized", (event) =>{
      notification.success({message:JSON.stringify(event)});



      const params =
      {
        code:event.code,
        state:event.state,
        verifier:'ac3e722ede6ff88fac10cb6e02e2f63ab0acf08148f91b699988e097',
      }

      getToken({params});

    });
    zoomSdk.authorize({
      state,
      codeChallenge:challenge,
    })
      .then((ret) => {
        notification.success({message:JSON.stringify(ret)});
      })
      .catch((e) => {
        notification.error({message:JSON.stringify(e)});
      });
  }

  useEffect(()=>
  {
    configAuth();  
   
  },[])
  
  return (
    <AppRouter/>

  );
}

export default App;
