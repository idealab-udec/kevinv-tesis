'use client'
import { useState, useEffect, useRef } from 'react';

import { SendHorizontal, Bot, SquareUserRound} from 'lucide-react';
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input";

export default function ChatInput() {
  const [userInput, setUserInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [temperature, setTemperature] = useState(0);
  const [maxTokens, setMaxTokens] = useState(1700);
  const [topP, setTopP] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const {toast} = useToast()
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsStreaming(true);
    setStreamedResponse('');

    try {
      const payload = {
        messages: messages,
        userInput,
        systemPrompt,
        temperature,
        maxTokens,
        topP,
      };
      setMessages(prevMessages => [...prevMessages, ['human', userInput]]);
      setUserInput('');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('API request failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulatedResponse = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        console.log("> STREAM: ", accumulatedResponse)
        setStreamedResponse(accumulatedResponse);
      }

      setMessages(prevMessages => [...prevMessages, ['assistant', accumulatedResponse]]);
      setIsStreaming(false);
      console.log("******** MESSAGES **************")
      console.log(messages)

    } catch (error) {
      console.error('Error:', error);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-auto bg-opacity-0">
      <div className="bg-transparent flex justify-center items-center ml-10">
        <div className="w-full max-w-[800px] h-[calc(100vh-150px)] bg-transparent rounded-lg flex flex-col ">
          {/* RENDERING THE MESSAGES */}
          <div className="flex-grow overflow-auto p-4 mb-11">
            {messages.map(([role, content], index) => (
              <div key={index} className={`mb-4 rounded-xl ${role === 'human' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-xl ${role === 'human' ? 'bg-[#003966] text-white' : 'bg-gray-200 text-black'}`}>
                { role === 'human' ? <SquareUserRound size={32} className='mr-2'/> : <Bot size={32}/>}{content}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="text-left">
                <div className="inline-block p-3 rounded-xl bg-gray-200 text-black">
                  {streamedResponse}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* END RENDERING MESSAGES */}
        </div>
      </div>

      {/* USER PROMPT INPUT */}
      <div className="fixed flex flex-col gap-1 bottom-0 left-0 right-0 p-2">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center mx-auto">
            <div className="grid w-full gap-1.5 min-w-[50vw]">
            <Label htmlFor="chatInput" className="text-white ml-1">Usuario:</Label>
            <Textarea
                id="chatInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escriba un mensaje..."
                className="text-gray-950 rounded-xl bg-gray-100"
                // className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="2"
            />
            {/* <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escriba un mensaje..."
                // className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="2"
            /> */}
            </div>
            <Button
                variant="outline"
                size="icon"
                type="submit"
                className="bg-[#fe9c14] h-11 w-11 text-[#512b1c] mt-5 rounded-xl hover:bg-[#fe9c14] hover:text-[#c44d1e]"
                disabled={isStreaming}
            >
                <SendHorizontal />
            </Button>
        </form>
      {/* END USER PROMPT INPUT */}

      {/* PARAMETERS CONFIG */}
        <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="max-w-[10vw] mx-6 h-10 bg-[#fe9c14] rounded-xl font-bold opacity-20 hover:opacity-100 hover:bg-[#fe9d14e0] transition-opacity duration-300" 
                variant="outline">
                  Parámetros
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#001D37] text-white sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Configuración</DialogTitle>
                <DialogDescription>
                    Edite la configuración del modelo.
                </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <label htmlFor="temperature" className="block mb-2 font-semibold text-white dark:text-white">Temperatura: {temperature}</label>
                    <input
                        id="temperature"
                        type="range"
                        defaultValue={0}
                        step={0.1}
                        min={0}
                        max={1}
                        onChange={(event) => {
                            setTemperature(parseFloat(event.target.value)) 
                        }}
                        className="w-full h-2 thumb-[#fe9c14] bg-gray-200 rounded-lg appearance-[#fe9c14] cursor-pointer dark:bg-[#fe9c14]"
                    />
                    <label htmlFor="system-prompt" className="block mt-1 font-semibold text-white dark:text-white">System Prompt:</label>
                    <input
                        type="text" 
                        value={systemPrompt} 
                        id="system-prompt"
                        onChange={(event) => {
                            setSystemPrompt(event.target.value)
                        }}
                        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {/* <!-- Input Number --> */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="integerInput" className="text-white font-semibold">
                            Max Tokens [50-4700]:
                            </label>
                            <input
                            type="number"
                            id="integerInput"
                            className="border rounded-md p-2 text-gray-900"
                            placeholder="Ingresa un número entero"
                            value={maxTokens}
                            onChange={(event) =>{
                                setMaxTokens(event.target.value)
                            }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="floatInput" className="text-white font-semibold">
                            Valor-P [0-1]:
                            </label>
                            <input
                            type="number"
                            step="0.01"
                            value={topP}
                            onChange={(event) => {
                                setTopP(event.target.value)
                            }}
                            id="floatInput"
                            className="border rounded-md p-2 text-gray-900"
                            placeholder="Ingresa un número decimal"
                            />
                        </div>
                    </div>
                    {/* <!-- End Input Number --> */}
                </div>
                </div>
                <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                    <Button 
                    className="bg-[#fe9c14] text-black hover:bg-[#fe9d14e0]" 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                        console.log("TOAST")
                        toast({
                          title: "Scheduled: Catch up",
                          description: "Friday, February 10, 2023 at 5:57 PM",
                        })
                      }}
                    >
                        Guardar y Cerrar
                    </Button>
                </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}