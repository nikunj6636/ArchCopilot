import { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Markdown from "react-markdown";
import "./App.css";
import LoaderComp from "./loader";
import { IoChatboxEllipsesOutline, IoLogoUsd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import Loader from "react-js-loader";
import { IoReorderThreeOutline } from "react-icons/io5";

// This component is responsible for the chat interface for the Architectural Knowledge Base (AKB). It allows users to interact with the AKB, view chat history, and ask questions about the AKB.
function AKBInterface({ api }) {
  const [currChatId, setcurrChatId] = useState("");
  const [currIndex, setcurrIndex] = useState();

  const [chatIds, setchatIds] = useState([]);
  const [chatTitles, setchatTitles] = useState([]);

  const [isFetching, setIsFetching] = useState(true);

  // Fetch chatIds
  useEffect(() => {
    fetch(`http://localhost:8080/api/getChatIds`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json()) // syntax to fetch the resposnse
      .then((data) => {
        console.log(data);
        setIsFetching(false);

        setchatIds(data.ids);
        setchatTitles(data.titles);

        setcurrChatId(data.ids[0]);
        setcurrIndex(0);
        // re-render is after the execution of all setter functions, ensuring latest change
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // effect will only run once after the initial render and will not re-run when any state or prop changes

  // scroll to the loader
  useEffect(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.scrollIntoView();
    }
  });

  return (
    <div className="w-full overflow-auto bg-[#222831]">
      <div className=" text-white text-xl font-mono flex flex-row w-full min-h-screen">
        <div className="md:basis-1/4 md:flex hidden w-full flex-1 max-h-screen overflow-y-auto flex-grow  bg-[black] pt-20">
          {isFetching ? (
            <Loader type="hourglass" size={50} />
          ) : (
            <ChatHistory
              setcurrChatId={setcurrChatId}
              currChatId={currChatId}
              setcurrIndex={setcurrIndex}
              currIndex={currIndex}
              setchatIds={setchatIds}
              chatIds={chatIds}
              chatTitles={chatTitles}
              setchatTitles={setchatTitles}
            />
          )}
        </div>
        <div className="w-full max-h-screen overflow-y-auto">
          <ChatInterface
            chatId={currChatId}
            currIndex={currIndex}
            chatTitles={chatTitles}
            setchatTitles={setchatTitles}
          />
        </div>
      </div>
    </div>
  );
}

function ChatHistory({
  setcurrChatId,
  setcurrIndex,
  currIndex,
  setchatIds,
  chatIds,
  currChatId,
  chatTitles,
  setchatTitles,
}) {
  const newChat = async () => {
    console.log("New Chat");

    await fetch(`http://localhost:8080/api/newChat`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => {
        const id = response.id;
        const title = response.title;
        setchatIds((prevchatIds) => [id, ...prevchatIds]);
        setchatTitles((prevchatTitles) => [title, ...prevchatTitles]);
        setcurrChatId(id);
        setcurrIndex(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className="hover:bg-[#222831] rounded-2xl py-3 md:flex md:flex-row w-11/12 ml-4 hidden"
        onClick={newChat}
      >
        <IoChatboxEllipsesOutline className=" text-2xl basis-1/4" />
        <p className="basis-5/12">New Chat</p>
        <CiEdit className="ml-4 text-2xl" />
      </button>
      <ul className="md:flex hidden pt-1 text-sm md:flex-col items-center">
        {chatIds.map((id, index) => (
          <button
            onClick={() => {
              setcurrChatId(id);
              setcurrIndex(index);
            }}
            className={`w-11/12 rounded-2xl p-4 text-start ${
              currChatId === id && currIndex === index
                ? "bg-[#222831]"
                : "hover:bg-[#222831]"
            }`}
            key={index}
          >
            {chatTitles[index]}
          </button>
        ))}
      </ul>
    </div>
  );
}

function ChatInterface({ chatId, api, currIndex, setchatTitles }) {
  const [isFetching, setIsFetching] = useState(0); // 0 means not asked, 1 means asking, 2 means asked

  const [chatHistory, setChatHistory] = useState([]);

  const [fetchingChat, setfetchingChat] = useState();

  useEffect(() => {
    console.log(chatId);

    setfetchingChat(true);

    // this is done intentionally to always show up the search bar.
    if (chatId !== "") {
      // as the fetch AKBChatIds is asynchronous hence chatId is empty for the first call
      fetch(`http://localhost:8080/api/getChatHistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chatId,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          setChatHistory(response.chatHistory);
          setfetchingChat(false); // after promise is resolved
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [chatId]);

  const handleSubmit = async (prompt) => {
    const url = `http://localhost:8080/api/chat`;

    setIsFetching(1);
    var tmpPromptResponse = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          session_id: chatId,
        }),
      });

      let decoder = new TextDecoderStream();
      if (!response.body) {
        setIsFetching(false);
        return;
      }

      const reader = response.body.pipeThrough(decoder).getReader();
      tmpPromptResponse = "";
      let emptyHistory = false;
      if (chatHistory.length === 0) emptyHistory = true;

      while (true) {
        var { value, done } = await reader.read();

        if (done) {
          if (emptyHistory) changeTitle();
          break;
        } else {
          if (tmpPromptResponse === "") {
            setChatHistory((chatHistory) => [
              ...chatHistory,
              {
                role: "user",
                content: prompt,
              },
              {
                role: "assistant",
                content: tmpPromptResponse,
              },
            ]);
            // console.log(chatHistory)
          }

          tmpPromptResponse += value;
          // change the last element of chatHistory
          setChatHistory((chatHistory) => [
            ...chatHistory.slice(0, chatHistory.length - 1),
            {
              role: "assistant",
              content: tmpPromptResponse,
            },
          ]);

          console.log("I am getting streamed response");
        }
      }
      setIsFetching(2);
    } catch (error) {
      setIsFetching(2);
      console.log(error);
    }
  };

  async function changeTitle() {
    // after complete streaming is done, mongodb is updated

    await fetch(`http://localhost:8080/api/changeTitle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: chatId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // Update the title at the specified index
        setchatTitles((prevchatTitles) => {
          const updatedTitles = [...prevchatTitles]; // Create a copy of the existing titles array
          updatedTitles[currIndex] = response.title; // Update the title at the specified index
          return updatedTitles; // Return the updated array
        });
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="text-center pt-20  text-white  pb-40  ">
      {api === "AKB" ? (
        <div className="text-xs sm:text-xl">Architecture knowledge base</div>
      ) : (
        <div className="text-xs sm:text-xl">Architecture Decision Records</div>
      )}
      {fetchingChat && chatId !== "" ? (
        <Loader type="hourglass" size={100} />
      ) : (
        <ResultItem chatHistory={chatHistory} />
      )}

      {isFetching === 1 && (
        <div
          className="w-full scale-75 pt-10  flex justify-center "
          style={{ textAlign: "center" }}
        >
          <LoaderComp />
        </div>
      )}

      <SearchBar isFetching={isFetching} handleSubmit={handleSubmit} />
    </div>
  );
}

function SearchBar({ isFetching, handleSubmit }) {
  const [prompt, setPrompt] = useState("");

  const handleClick = () => {
    if (prompt.trim()) {
      // Check if the prompt is not empty
      handleSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission on Enter keypress
      handleClick(); // Calls handleClick to trigger submit
    }
  };

  return (
    <div className="fixed bottom-0 w-full pb-10 bg-[#222831]">
      <div className="flex flex-row items-center">
        <div className="md:basis-7/12 lg:pl-24 md:pl-10  bg-[#222831]  pl-5 md:w-3/4 w-full">
          <TextField
            className="w-full rounded-xl"
            id="outlined-multiline-flexible"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={5} // Set max height and enable scrolling
            sx={{ backgroundColor: "#EEEEEE" }}
            placeholder="Enter Question"
          />
        </div>

        <div className="sm:text-xl text-sm">
          <button
            variant="contained"
            className="md:basis-1/12 py-2 sm:mx-8 mx-1 sm:px-4 px-1 rounded-xl border  hover:bg-[#222831] bg-[black] text-white"
            onClick={handleClick}
            disabled={isFetching === 1}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultItem({ chatHistory }) {
  const endRef = useRef(null);

  useEffect(() => {
    // Scroll to the end of the list when chatHistory updates
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return chatHistory
    .map((chat, index) => {
      return (
        <div
          className=" text-justify font-serif ml-[10%] md:w-[60%] w-10/12  bg-[#222831] text-white p-3"
          key={index}
        >
          <div className={chat.role}>
            <div className="flex items-center">
              <FaUser className="mr-2 mb-2" />
              <h2 className="text-lg pl-2 font-bold uppercase">{chat.role}</h2>
            </div>
            <div className="text-sm sm:text-lg ">
              <Markdown>{chat.content}</Markdown>
            </div>
          </div>
        </div>
      );
    })
    .concat(<div key="endRef" ref={endRef}></div>);
}

export default AKBInterface;
