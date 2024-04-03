import React, { createContext, useState } from "react";
import runChat from "../Config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextChar) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextChar);
        }, 20 * index); // Decreased delay time
    };

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
       
       setResultData("")
        setLoading(true);

        setShowResult(true);
        setRecentPrompt(input);
        setPrevPrompts(prev =>[...prev , input])
        const response = await runChat(input);
        let responseText = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        
        // Replace single stars with HTML line breaks
        responseText = responseText.replace(/\*/g, "<br>");
        
        // Typewriter effect
        setResultData(""); // Reset result data
        for (let i = 0; i < responseText.length; i++) {
            const nextChar = responseText[i];
            delayPara(i, nextChar);
        }

        setLoading(false);
        setInput(""); // Reset the input box
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
