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
// import div from '@mui/material/div';
import "./App.css";


// This component is responsible for adding Architectural Decision Records (ADRs) to the database. It provides a form for users to input ADR details and displays a visual representation of the ADR structure.

const AddTextField = styled(TextField)({
  backgroundColor: "#ffffff",
  marginTop: "0.75rem",
});

export default function ADR() {
  const [url, setUrl] = useState("");
  const [context_h, setContext_h] = useState("");
  const [decision_h, setDecision_h] = useState("");
  const [context_e, setContext_e] = useState("");
  const [decision_e, setDecision_e] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const options = {
      strings: [
        '<span style="display:inline-block">## Context --> Context heading</span>\
        <br/> <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span> </br></br>\
        <span style="display:inline-block">## Options --> Context Ending</span>\
        <br/> <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span> </br></br>\
        <span style="display:inline-block">## Decision --> Decision heading</span><br/>\
        <span style="display:inline-block">______________________</span> <br/>\
        <span style="display:inline-block">______________________</span><br/>\
        <br/><span style="display:inline-block">## Status --> Decision Ending</span><br/>\
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
    setContext_h(event.target.value);
  };
  const handleChange_D = (event) => {
    setDecision_h(event.target.value);
  };

  const handleChange_CE = (event) => {
    setContext_e(event.target.value);
  };
  const handleChange_DE = (event) => {
    setDecision_e(event.target.value);
  };
  async function handleClick() {
    console.log(url);
    setLoading(true);
    const response = await fetch("http://localhost:8080/api/submiturl_adr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url,
        context_h: context_h,
        decision_h: decision_h,
        context_e: context_e,
        decision_e: decision_e,
      }),
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
        <div className="basis-1/2 p-5 py-20 ">
          <div className="type-wrap ">
            <span
              id="typed"
              className="text-white "
              sx={{ display: "inline-block" }}
            ></span>
          </div>
        </div>

        <div className="basis-1/2 mt-[5%] text-white px-8 ">
          <div className="pb-10">
            <div className="text-[30px] font-mono underline underline-offset-8 pb-8">
              <h2>Add ADRs to the database</h2>
            </div>
            <div className="flex flex-col ">
              <label>Enter the github url *</label>

              <AddTextField
                className="rounded-xl border"
                id="outlined-basic"
                placeholder="Eg: https://github.com/repo_name/path/to/adrs"
                value={url}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="sm:flex flex-row pb-5">
            <div className="basis-1/2 pr-5">
              <div className="addElement">
                <label>Enter Context Heading *</label>

                <AddTextField
                  className="rounded-xl border"
                  id="outlined-basic"
                  placeholder="Eg: ## Context"
                  value={context_h}
                  onChange={handleChange_C}
                  variant="outlined"
                />
              </div>
            </div>

            <div className="basis-1/2">
              <div className="addElement">
                <label>Enter Decision Heading *</label>

                <AddTextField
                  className="rounded-xl border"
                  id="outlined-basic"
                  placeholder="## Decision"
                  value={decision_h}
                  onChange={handleChange_D}
                  variant="outlined"
                />
              </div>
            </div>
          </div>

          <div className="sm:flex flex-row pb-5">
            <div className="basis-1/2 pr-5">
              <div className="addElement">
                <label>Enter Context Ending</label>
                <AddTextField
                  className="rounded-xl border"
                  id="outlined-basic"
                  placeholder="Eg: ## Options "
                  value={context_e}
                  onChange={handleChange_CE}
                  variant="outlined"
                />
              </div>
            </div>

            <div className="basis-1/2">
              <div className="addElement">
                <label>Enter Decision Ending</label>
                <AddTextField
                  className="rounded-xl border"
                  id="outlined-basic"
                  placeholder="## Status"
                  value={decision_e}
                  onChange={handleChange_DE}
                  variant="outlined"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              className=" rounded-2xl py-3 px-7 border hover:bg-[#222831] bg-[black] text-white"
              variant="contained"
              onClick={handleClick}
            >
              Submit
            </button>
            {loading == true && <LoaderComp sx={{ marginTop: 2 }}></LoaderComp>}
            {isOpen && (
              <Popup
                content={<div style={{ color: "black" }}>{message}</div>}
                handleClose={togglePopup}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
