import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Typed from "typed.js";
import Popup from "./Popup";
import Navbar from "./navbar";
import LoaderComp from "./loader";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import "./App.css";


// This component provides an interface for adding new resources or information to the system. It displays cards with options for different types of additions.

const AddTextField = styled(TextField)({
  backgroundColor: "#ffffff",
  marginTop: "0.75rem",
});

export default function KB() {
  const [url, setUrl] = useState("");
  const [keywords, setkeywords] = useState("");
  //   const [decision_h, setDecision_h] = useState('');
  //   const [context_e, setContext_e] = useState('');
  //   const [decision_e, setDecision_e] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const options = {
      strings: [
        '<span style="display:inline-block">Attributes --> Keyword1</span>\
        <br/> <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span> </br></br>\
        <span style="display:inline-block">Constraints --> Keyword2</span>\
        <br/> <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span> </br></br>\
        <span style="display:inline-block">Functions --> Keyword3</span><br/>\
        <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span><br/>\
        <br/><span style="display:inline-block">Tradeoffs --> Keyword4</span><br/>\
        <span style="display:inline-block">______________________</span><br/>\
        <span style="display:inline-block">______________________</span><br>\
        <br/><span style="display:inline-block">Keyword5 and so on.......</span><br/>\
        <span style="display:inline-block">______________________</span><br/>\
        <span style="display:inline-block">______________________</span>',
      ],
      typeSpeed: 30,
      startDelay: 150,
      loop: false,
      cursorChar: "|",
      contentType: "html", // or 'text'
      onComplete: function (self) {
        self.cursor.remove();
      },
    };
    const typed = new Typed("#typed", options);

    return () => {
      typed.destroy();
    };
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleChange_C = (event) => {
    setkeywords(event.target.value);
  };
  async function handleClick() {
    console.log(url);
    console.log(keywords);
    setLoading(true);
    const response = await fetch("/submiturl_kb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url, keywords: keywords }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data["message"]);
        setIsOpen(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="md:flex flex-row items-center w-full min-h-screen bg-[#222831]">
        <div className="basis-1/2 p-5 pt-20 ">
          <div className="type-wrap ">
            <span
              id="typed"
              className="text-white "
              sx={{ display: "inline-block" }}
            ></span>
          </div>
        </div>

        <div className="basis-1/2 mt-[5%] text-white px-16 ">
          <div className="pb-10">
            <div className="text-[30px] font-mono underline underline-offset-8 pb-8">
              <h2>Add Knowledge Base Documents to the database</h2>
            </div>
            <div className="flex flex-col ">
              <label style={{ textAlign: "left" }}>
                Enter the website url *
              </label>

              <AddTextField
                className="rounded-xl border"
                id="outlined-basic"
                placeholder="Eg: https://link/to/the/specific/knowledgebase/website/page"
                value={url}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="flex flex-col ">
            <div className="addElement">
              <label>
                Enter the Keywords with a comma ',' between each keyword *
              </label>

              <AddTextField
                className="rounded-xl border"
                id="outlined-basic"
                placeholder="Eg: Attributes,Constraints,Functions,Tradeoffs"
                value={keywords}
                onChange={handleChange_C}
                variant="outlined"
              />
            </div>
          </div>

          <div>
            <button
              className=" rounded-2xl py-3 mt-5 px-7 border hover:bg-[#222831] bg-[black] text-white"
              variant="contained"
              onClick={handleClick}
            >
              Submit
            </button>
            {loading == true && <LoaderComp sx={{ marginTop: 2 }}></LoaderComp>}
            {/* {isOpen && (
              <Popup
                content={<div style={{ color: "black" }}>{message}</div>}
                handleClose={togglePopup}
              />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
