
import React, { useState, useEffect } from 'react';
import './Microo.css'; 

const Microo = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [active, setActive] = useState(false);
  const [language, setLanguage] = useState('EN');

  const handleToggle = () => {
    setActive(!active);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.checked ? 'HI' : 'EN';
    setLanguage(newLanguage);
    console.log('Current Language: ', newLanguage);
  };

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new speechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language === 'EN' ? 'en-IN' : 'hi-IN';

    recognitionInstance.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(currentTranscript);

      if (event.results[event.results.length - 1].isFinal) {
        console.log('Final Transcribed Text:', currentTranscript);
        const transcribedTextJson = JSON.stringify({ text: currentTranscript });
        console.log('Transcribed Text in JSON:', transcribedTextJson);
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, [language]); 

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
      handleToggle(); 
    }
  };

  return (
    <div className="container">
     
      <div className="switch">
        <input
          id="language-toggle"
          className="check-toggle check-toggle-round-flat"
          type="checkbox"
          checked={language === 'HI'}
          onChange={handleLanguageChange}
        />
        <label htmlFor="language-toggle"></label>
        <span className="on">EN</span>
        <span className="off">HI</span>
      </div>

      
      <div className="load-container">
    
        <div
          className="text"
          id="text"
          style={{
            opacity: active ? '1' : '0',
            visibility: active ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease',
            marginBottom: '20px' 
          }}
        >
          Listening
        </div>

        
        <div className={`load ${active ? 'active' : ''}`} id="loader">
          <div className="progress"></div>
         <div className="progress"></div>
          <div className="progress"></div>
        </div>
      
      </div>

     
      <button className="btt" onClick={toggleListening}>
        {isListening ? 'Stop' : 'Record'}
      </button>
    </div>
  );
};

export default Microo;
