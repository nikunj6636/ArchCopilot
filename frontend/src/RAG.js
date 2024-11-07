import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Markdown from "react-markdown";
import "./App.css";
import LoaderComp from "./loader";

function RAG() {
  const [promptArea, setPromptArea] = useState("");
  const [promptResponse, setPromptResponse] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const url = "http://localhost:8080/api/change_model";
    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }, [model]);

  const handleSubmit = async () => {
    const url = "http://localhost:8080/api/decision_adr";
    setIsFetching(true);
    var tmpPromptResponse = "";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptArea,
        }),
      });

      // const data = await response.json();
      // setPromptResponse(data.response);
      // console.log(data.response);
      // eslint-disable-next-line no-undef
      let decoder = new TextDecoderStream();
      if (!response.body) {
        setIsFetching(false);
        return;
      }

      const reader = response.body.pipeThrough(decoder).getReader();

      while (true) {
        var { value, done } = await reader.read();

        if (done) {
          break;
        } else {
          tmpPromptResponse += value;
          setPromptResponse(tmpPromptResponse);
          console.log("I am getting streamed response");
        }
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full overflow-auto min-h-screen pt-[60px] bg-[#222831]">
      <div className=" text-white text-xl font-mono flex flex-row w-full items-start">
        <div className="w-[300px] text-center bg-[black] fixed min-h-screen flex-grow pt-8">
          HISTORY
        </div>
        <div className="basis-1/6"></div>
        <div className="basis-4/6 pt-8">
          Check out decisions made by architects in similar contexts
        </div>
        <div className="basis-1/6 pt-8">
          <select
            className="text-black"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gpt-3.5-turbo " className="text-black">
              GPT-3.5 Turbo
            </option>
            <option value="gemini-1.0-pro-latest " className="text-black">
              Gemini 1.0 Pro
            </option>
          </select>
        </div>
      </div>
      <div className=" fixed bottom-0 flex items-end w-full bg-[#222831]">
        <div className=" bg-black w-[300px] h-[150px] "></div>
        <div div className="basis-6/12  pr-10 pb-10 pt-5 rounded pl-20 ">
          <TextField
            className="w-full"
            id="filled-multilined-flexible"
            value={promptArea}
            onChange={(e) => setPromptArea(e.target.value)}
            multiline
            maxRows={5}
            rows={5} // Set the number of rows to display
            inputProps={{
              style: { height: "auto", maxHeight: "30px", overflowY: "auto" },
            }} // Set max height and enable scrolling
            sx={{ backgroundColor: "#EEEEEE" }}
            placeholder="Enter Question"
          />
        </div>
        <button
          variant="contained"
          className="basis-1/12 mb-10 mt-5  flex items-start rounded pt-4 mr-5 pr-5 border py-3 px-8 hover:bg-[#222831] bg-[black] text-white"
          onClick={handleSubmit}
          disabled={isFetching}
        >
          Search
        </button>

        <button
          className="basis-1/12  mb-10 mt-5   flex items-start rounded pt-4 pr-5 border py-3 px-10 hover:bg-[#222831] bg-[black] text-white"
          variant="contained"
          onClick={() => setPromptArea("")}
        >
          Clear
        </button>
      </div>
      <ResultItem result={promptResponse} loader={isFetching} />
    </div>
  );
}

function ResultItem({ result, loader }) {
  return (
    <div className=" top-28 ml-96 pt-10 mr-52">
      <p className="text-white text-2xl font-mono ">Decision</p>
      <div className="w-full scale-50  flex justify-center ">
        {loader ? <LoaderComp></LoaderComp> : <></>}
      </div>
      <Markdown className="text-white text-justify pt-4 font-mono text-sm pb-36  ">
        {result}
      </Markdown>
    </div>
  );
}

export default RAG;
