import "./App.css";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoaderComp from "./loader";

function ChatInterface() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { from: "user", message: input }];
    setChatLog(chatLogNew);
    let msg = input;
    setInput("");
    console.log(chatLog);
    setLoading(true);
    await fetch(`http://localhost:8080/api/get_decision?context=${msg}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setChatLog([...chatLogNew, { from: "gpt", message: data["response"] }]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function handleInputChange(e) {
    setInput(e.target.value);
  }
  return (
    <div className="bg-[#222831] min-h-screen w-full">
      <div className="flex flex-row w-full ">
        <div className="basis-1/4 pt-20 font-mono min-h-screen text-xl bg-black text-white">
          HISTORY
        </div>
        <div className=" w-full bg-[#222831]">
          {chatLog.map((item, index) => (
            <ChatItem
              item={item}
              index={index}
              chatLog={chatLog}
              setChatLog={setChatLog}
            />
          ))}
        </div>
      </div>
      {loading ? <LoaderComp></LoaderComp> : <></>}
      {/* <div className="space"></div> */}

      <div className=" fixed bottom-0 flex w-full  pb-10 ">
        <div className="basis-3/4  rounded  pl-96 pr-5 ">
          <TextField
            value={input}
            className="w-full"
            multiline
            placeholder="Ask Question"
            rows="1"
            onChange={handleInputChange}
            sx={{ backgroundColor: "#EEEEEE" }}
          ></TextField>
        </div>

        <button
          variant="contained"
          className="basis-1/12 flex items-start rounded pt-4 pr-5 border py-3 px-8 hover:bg-[#222831] bg-[black] text-white"
          onClick={handleSubmit}
          disabled={input == ""}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;

function ChatItem({ item, index, chatLog, setChatLog }) {
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState(item.message);

  function handleDiscard() {
    setEdit(!edit);
    setEditText(item.message);
  }
  async function handleSave() {
    setEdit(!edit);
    const response = await fetch(`/edit_and_save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: chatLog[index - 1].message,
        decision: editText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data["message"] == "Success") {
          console.log("came");

          let chatLogNew = [...chatLog];
          chatLogNew[index].message = editText;
          setChatLog(chatLogNew);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleEdit() {
    setEdit(!edit);
  }

  function handleTextChange(e) {
    setEditText(e.target.value);
  }
  return (
    <>
      {item && (
        <>
          {item.from === "gpt" ? (
            <div className="chat-message chatgpt">
              <div className="avatar chatgpt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={40}
                  height={40}
                  viewBox="0 0 48 48"
                >
                  <title>{"ai"}</title>
                  <g data-name="Layer 2">
                    <path
                      fill="none"
                      d="M0 0h48v48H0z"
                      data-name="invisible box"
                    />
                    <g data-name="Q3 icons">
                      <path d="M45.6 18.7 41 14.9V7.5a1 1 0 0 0-.6-.9l-9.9-4.5h-.4l-.6.2L24 5.9l-5.5-3.7-.6-.2h-.4L7.6 6.6a1 1 0 0 0-.6.9v7.4l-4.6 3.8a.8.8 0 0 0-.4.8v9a.8.8 0 0 0 .4.8L7 33.1v7.4a1 1 0 0 0 .6.9l9.9 4.5h.4l.6-.2 5.5-3.6 5.5 3.7.6.2h.4l9.9-4.5a1 1 0 0 0 .6-.9v-7.5l4.6-3.8a.8.8 0 0 0 .4-.7v-9.2a.8.8 0 0 0-.4-.7Zm-5.1 6.8H42v1.6l-3.5 2.8-.4.3-.4-.2a1.4 1.4 0 0 0-2 .7 1.5 1.5 0 0 0 .6 2l.7.3v5.4l-6.6 3.1-4.2-2.8-.7-.5V25.5H27a1.5 1.5 0 0 0 0-3h-1.5V9.7l.7-.5 4.2-2.8L37 9.5v5.4l-.7.3a1.5 1.5 0 0 0-.6 2 1.4 1.4 0 0 0 1.3.9l.7-.2.4-.2.4.3 3.5 2.9v1.6h-1.5a1.5 1.5 0 0 0 0 3Zm-19.5 0h1.5v12.8l-.7.5-4.2 2.8-6.6-3.1v-5.4l.7-.3a1.5 1.5 0 0 0 .6-2 1.4 1.4 0 0 0-2-.7l-.4.2-.4-.3L6 27.1v-1.6h1.5a1.5 1.5 0 0 0 0-3H6v-1.6l3.5-2.8.4-.3.4.2.7.2a1.4 1.4 0 0 0 1.3-.9 1.5 1.5 0 0 0-.6-2L11 15V9.5l6.6-3.1 4.2 2.8.7.5v12.8H21a1.5 1.5 0 0 0 0 3Z" />
                      <path d="M13.9 9.9a1.8 1.8 0 0 0 0 2.2l2.6 2.5v2.8l-4 4v5.2l4 4v2.8l-2.6 2.5a1.8 1.8 0 0 0 0 2.2 1.5 1.5 0 0 0 1.1.4 1.5 1.5 0 0 0 1.1-.4l3.4-3.5v-5.2l-4-4v-2.8l4-4v-5.2l-3.4-3.5a1.8 1.8 0 0 0-2.2 0ZM31.5 14.6l2.6-2.5a1.8 1.8 0 0 0 0-2.2 1.8 1.8 0 0 0-2.2 0l-3.4 3.5v5.2l4 4v2.8l-4 4v5.2l3.4 3.5a1.7 1.7 0 0 0 2.2 0 1.8 1.8 0 0 0 0-2.2l-2.6-2.5v-2.8l4-4v-5.2l-4-4Z" />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="message">
                {index == chatLog.length - 1 ? (
                  <>
                    {" "}
                    {edit == false && item.message}
                    {edit == true && (
                      <TextField
                        id="filled-multilined-flexible"
                        fullWidth
                        multiline
                        value={editText}
                        onChange={handleTextChange}
                      />
                    )}
                    {edit == false && (
                      <div>
                        <Button
                          variant="contained"
                          sx={{ marginTop: "10px", width: "20ch" }}
                          onClick={handleEdit}
                        >
                          Edit Decision
                        </Button>{" "}
                      </div>
                    )}
                    {edit == true && (
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleSave}
                          sx={{ m: 3, width: "20ch" }}
                        >
                          Save to db
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleDiscard}
                          sx={{ m: 3, width: "20ch" }}
                        >
                          Discard
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>{item.message}</>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-message">
              <div className="avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={40}
                  height={40}
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path fill="#000" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M16 15.5c0-3.191-2.686-5.5-6-5.5s-6 2.309-6 5.5l.002 1.5a1 1 0 0 0 1 1H15a1 1 0 0 0 1-1v-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="message">{item.message}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
