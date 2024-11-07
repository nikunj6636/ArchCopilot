import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { motion } from "framer-motion";

// This component represents the home page of the application. It displays cards for different features of the application, such as adding resources and accessing the Architectural Decision Record chatbot.
export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-[#222831] bg-cover  md:flex items-center px-5 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="px-5 basis-1/2 py-5"
        >
          <CardComponent
            imageSrc="1"
            heading="Have software architecture resources?"
            content="Add resources to make model better"
            navigatePath="/adr"
          ></CardComponent>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="px-5 basis-1/3 py-5"
        >
          <CardComponent
            imageSrc="2"
            // heading="Confused in taking Architectural descisions?"
            heading="Architectural Knowledge Base chatbot"
            content="Try ArchAI, that will assist you in
            taking the appropriate decisions"
            navigatePath="/akb_chat"
          ></CardComponent>
        </motion.div> */}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="px-5 basis-1/2 py-5"
        >
          <CardComponent
            imageSrc="3"
            // heading="Check past Architect decisions"
            heading="Architectural Decision Record chatbot"
            content="Search what decisions were made by architects in
            similar contexts "
            navigatePath="/adr_chat"
          ></CardComponent>
        </motion.div>
      </div>
    </>
  );
}

function CardComponent({ imageSrc, heading, content, navigatePath }) {
  const navigate = useNavigate();
  return (
    <Card>
      <div
        className="flex  place-content-center py-3 "
        style={{ marginTop: "7vh" }}
      >
        {imageSrc == "1" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="_x32_"
            width={100}
            height={100}
            viewBox="0 0 512 512"
          >
            <style>{".st0{fill:#000}"}</style>
            <path
              d="M507.34 98.426c-5.269-12.142-14.39-22.598-25.948-31.612-17.387-13.51-40.586-24.054-67.719-31.464-27.134-7.384-58.235-11.534-91.338-11.534-50.447.033-96.203 9.566-130.465 25.734-17.132 8.126-31.465 17.922-42.002 29.67-5.252 5.877-9.541 12.282-12.545 19.206-2.997 6.924-4.668 14.39-4.66 22.03v30.08l26.162 19.856v-4.346c15.132 13.838 36.379 24.877 61.792 33.052 29.299 9.36 64.204 14.736 101.718 14.736 50.028-.024 95.371-9.508 129.058-25.421 13.55-6.421 25.126-13.93 34.444-22.482v58.845c-1.86 3.992-4.511 7.993-8.1 12.027-11.591 13.056-32.583 25.355-59.652 33.958-27.067 8.661-60.12 13.814-95.75 13.806-9.278.008-18.3-.444-27.166-1.111l-22.886 17.37a372.18 372.18 0 0 0 50.052 3.368c50.028-.025 95.371-9.516 129.058-25.422 13.55-6.421 25.126-13.928 34.444-22.482v58.845c-1.86 3.992-4.511 7.994-8.1 12.035-11.591 13.057-32.583 25.348-59.652 33.959-27.067 8.66-60.12 13.813-95.75 13.806-46.232.025-88.061-8.751-118.125-22.441l-17.551 13.319c10.184 5.343 21.569 10.019 33.958 14.004 29.299 9.36 64.204 14.735 101.718 14.744 50.028-.024 95.371-9.516 129.058-25.421 13.55-6.422 25.126-13.938 34.444-22.491v44.891c0 3.894-.806 7.689-2.502 11.648-2.964 6.891-8.941 14.3-18.013 21.355-13.583 10.611-33.9 20.186-58.531 26.87-24.623 6.701-53.552 10.62-84.455 10.612-47.08.041-89.625-9.146-119.269-23.224-14.835-6.997-26.36-15.213-33.687-23.454-3.688-4.116-6.339-8.216-8.043-12.159-1.704-3.96-2.503-7.754-2.511-11.648v-4.602l-24.276 18.423c.741 2.8 1.63 5.557 2.774 8.208 5.276 12.142 14.39 22.597 25.948 31.62 17.395 13.51 40.593 24.055 67.727 31.464 27.133 7.384 58.235 11.525 91.337 11.533 50.456-.041 96.195-9.565 130.457-25.742 17.14-8.124 31.464-17.913 42.001-29.669 5.253-5.87 9.55-12.275 12.546-19.206 2.997-6.915 4.676-14.391 4.66-22.03V120.456c.016-7.64-1.663-15.107-4.66-22.03zm-21.503 35.983c-1.86 3.993-4.511 8.002-8.1 12.036-11.591 13.064-32.583 25.355-59.652 33.966-27.067 8.66-60.12 13.813-95.75 13.806-47.5.024-90.448-9.196-120.669-23.536-15.123-7.146-26.994-15.552-34.732-24.236-3.59-4.034-6.249-8.043-8.11-12.028v-13.962c.008-3.895.807-7.681 2.511-11.641 2.964-6.899 8.932-14.3 18.012-21.363 13.576-10.611 33.892-20.185 58.524-26.862 24.631-6.709 53.559-10.62 84.463-10.612 47.081-.041 89.625 9.146 119.262 23.224 14.835 6.989 26.359 15.205 33.686 23.454 3.688 4.116 6.338 8.208 8.052 12.159 1.695 3.96 2.502 7.746 2.502 11.641v13.954z"
              className="st0"
            />
            <path
              d="M238.572 278.663 88.242 164.564v59.643H0V333.12h88.242v59.643z"
              className="st0"
            />
          </svg>
        )}
        {imageSrc == "2" && (
          <svg
            className="text-white"
            xmlns="http://www.w3.org/2000/svg"
            width={100}
            height={100}
            viewBox="0 0 512 512"
          >
            <path d="M340 32.1c-25.8 1.8-51.3 10.6-74 25.7-12.1 8-31.9 28-40.3 40.7-14.7 22.3-23.5 47.8-25.3 73.2l-.7 8.9-8.1-1.8c-17.6-3.9-44-4-62.1-.3-29.3 6-55.2 20-77.1 41.9-21.8 21.8-34.8 45.6-41.6 75.7-2 9.1-2.3 13-2.3 31.9 0 17.2.4 23.2 1.9 30 4.2 19.5 11.7 37.7 22.1 53.6 3.1 4.8 5.4 9.2 5.2 9.8-.3.6-7.1 11.4-15.1 24.1C7.7 469 6.4 472.1 9 477c2.5 4.6 4.7 4.4 44.5-4.5l37.6-8.3 8.7 3.9c29.2 12.8 65.8 15.8 97.4 7.8 28.4-7.1 52.5-21.3 73.4-43.2 23.8-24.9 39.1-58.9 41.1-91.5.5-8 .9-10.2 1.9-9.8 11.4 4.4 51.3 5.7 67.4 2.3 12.2-2.6 24.4-6.4 32.7-10.2l7.2-3.3 35.8 7.9c34.7 7.7 40.3 8.6 43.8 7.3 2.3-.9 4.8-6.2 4.1-9-.4-1.3-6.9-12.2-14.5-24.3-7.7-12.1-14.5-22.9-15.1-24-.9-1.7-.5-2.9 2.3-6.8 19.4-27.3 29.7-65.4 26.8-99.1-3.4-38.4-18-70-44.8-96.5-31.9-31.6-73.4-46.8-119.3-43.6zm26.7 17.4c4 .4 11.8 1.7 17.3 3.1 28.4 6.8 54.6 23.4 72.6 45.8 13.2 16.4 22 34 27.1 54.3 2.6 10 2.8 12.3 2.8 31.3 0 19.3-.2 21.1-2.8 31.5-5 19.2-11.9 33.9-23 48.8-4.2 5.6-5.9 8.9-6 11.2-.1 2.5 2.6 7.4 11.1 21 6.2 9.8 11.1 17.9 11 18.1-.2.1-12.4-2.4-27.2-5.7-14.8-3.2-28.3-5.9-30.1-5.9-1.8 0-7 1.8-11.6 3.9-26.2 12.3-57.7 15.3-87.4 8.5-3.8-.9-7.4-2-7.8-2.4-.5-.4-1.7-5.7-2.7-11.6-8-46.7-38.7-87.9-81.7-109.5l-12.2-6.2.5-7.6c2.4-35.6 15.7-65.5 39.9-89.6 22.8-22.8 51.6-36.4 83.5-39.4 8.3-.8 12-.8 26.7.4zM173 193.4c33.3 2.2 69.5 21.5 91.6 49 13.2 16.4 22 34 27.1 54.3 2.6 10 2.8 12.2 2.8 31.3 0 18.1-.3 21.6-2.4 30-13.6 55.2-56.9 95.2-112.6 104-9.9 1.6-31.5 1.3-41.8-.5-10.8-1.9-25.5-6.5-35-11.1-4.1-1.9-8.7-3.4-10.7-3.4-1.9 0-15.4 2.7-30 5.9s-26.7 5.7-26.8 5.6c-.2-.2 4.6-8.2 10.7-17.8 13.2-20.8 13.4-21.8 6.8-30.5-13.1-17.1-22.5-38.7-26.3-60.5-2.4-14-1.5-39.7 2-53.5 12.5-49.7 50.9-87.9 100.2-99.8 9.9-2.4 27.7-4.4 33.4-3.8 1.4.2 6.3.5 11 .8z" />
            <path d="M288 136v8h128v-16H288v8zM288 184v8h128v-16H288v8zM320 232v8h96v-16h-96v8zM109.7 281.8c-1.3 1.4-25.7 90.5-25.7 93.6 0 .3 3.9.6 8.8.6h8.7l4.1-15.8 4.1-15.7 14-.3 14-.3 3.9 15.1c2.1 8.3 4.1 15.6 4.5 16.1.3.6 4.2.9 9.1.7l8.5-.3-12-45.5c-8.6-32.9-12.5-46.1-14-47.8-1.9-2-2.9-2.2-14.2-2.2-10.5 0-12.4.3-13.8 1.8zm16.2 17.9c3.5 13 7.1 26.9 7.1 27.5 0 .5-4.2.8-9.4.8h-9.4l4.1-16c2.5-9.6 4.7-16 5.4-16 .7 0 1.7 1.7 2.2 3.7zM179 288v8h20v64h-20v16h57v-16h-20v-64h20v-16h-57v8z" />
          </svg>
        )}
        {imageSrc == "3" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={100}
            height={100}
            viewBox="0 0 120 120"
          >
            <path d="M45.1 12.6c-15.7 4.2-28.5 17.1-32.6 32.9-6.7 25.8 11 52.4 37.5 56.4 30.2 4.6 56.2-21.3 51.9-51.7C98.1 23.7 71 5.6 45.1 12.6zm21.5 10.9c19.9 5.9 30.5 28.5 22 47.1C86.2 75.9 77.8 86 75.8 86c-.4 0-.8-3.7-.8-8.2 0-7.2.3-8.5 2.4-10.7 2-2.2 2.4-4 2.9-10.8.4-6.4.2-8.3-.9-8.7-1.9-.7-4.8 2.4-3.5 3.7.6.6 1.1 3.6 1.1 6.7 0 4.7-.4 6-2.5 8-2.3 2.2-2.5 3-2.5 12.2v9.9l-3.2 1.4c-1.8.7-3.6 1.1-4 .9-.5-.3-.8-7.2-.8-15.5 0-15.8.2-16.5 4.9-14 2.2 1.2 4.4-.1 3.9-2.5-.3-1.6-1.1-1.9-4.6-1.6-4.2.2-4.2.2-4.2-3.1 0-3.4 1.8-5.8 5.3-7 1.8-.7 2.4-4.6.7-4.9-.5 0-1.4-.1-1.9-.2s-2.1 1.6-3.5 3.7C62 49.1 62 49.2 62 70v21l-2.5.6C53.9 93 54 93.3 54 65.2c0-17.9.3-26.1 1.1-26.9 1.7-1.7.3-4.3-2.1-4.3s-3.8 2.6-2.1 4.3c1.2 1.2 1.6 16.7.3 16.7-1.2 0-7.8-7.2-8.6-9.3-.4-1.2-1.4-1.7-2.8-1.5-3.2.4-3.5 3.6-.6 4.7 1.3.5 4.7 3.4 7.6 6.4l5.2 5.6v15c0 16.3 0 16.2-5.4 14.1-2.6-.9-2.6-1.1-2.6-11.3V68.4L40.5 65c-1.9-1.8-3.2-3.6-3-4 .8-1.2-2.4-3.3-4-2.6-2.1.8-1.9 4.5.3 5.3.9.3 2.9 1.7 4.5 3.1 2.6 2.5 2.7 3 2.7 12v9.4l-4.7-3.5c-23.1-17-16.7-52.6 11-61.2 5.7-1.8 13.3-1.8 19.3 0z" />
            <path d="M94 86.6c-1.3 2-4.3 5.1-6.7 6.9L83 96.7l5.5 5.2c5.7 5.4 8.2 6.1 13 3.9 1.5-.7 3.3-2.4 4.1-3.9 2.5-5 1.8-7.7-3.8-13.5L96.5 83 94 86.6z" />
          </svg>
        )}
      </div>
      <CardContent>
        <Typography
        className="px-5"
          gutterBottom
          variant="h5"
          component="div"
        >
          {heading}
        </Typography>
        <Typography
          className="px-6 "
          variant="body1"
          color="text.secondary"
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions className=" place-content-center">
        <a href={navigatePath} style={{ textDecoration: "none" }}>
          <button
            className="border rounded-2xl py-3 px-7 hover:bg-[#222831] bg-[black] text-white"
            onClick={() => navigate(navigatePath)}
          >
            Explore
          </button>
        </a>
      </CardActions>
    </Card>
  );
}
