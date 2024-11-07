import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import "./App.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


// This component provides an interface for adding new resources or information to the system. It displays cards with options for different types of additions.

export default function Add() {
  return (
    <>
      <div className="min-h-screen w-full bg-[#222831] bg-cover sm:flex justify-center items-center md:px-36">
        {/* <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="px-5 items-center sm:pt-0 pt-20 "
        >
          <CardComponent
            imageSrc="1"
            heading="Have a repository of Architecture Decision Records?"
            content="Your ADRs could help us in bulding better models.
        Want to share your ADRs with us?"
            navigatePath="/adr"
          ></CardComponent>
        </motion.div> */}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="px-5 basis-1/2 py-5"
        >
          <CardComponent
            imageSrc="2"
            heading="Have a website with Architecture Knowledge Bases?"
            content="Your AKBs could help us in bulding better models.
        Want to share your AKBs with us?"
            navigatePath="/add_kb"
          ></CardComponent>
        </motion.div>
      </div>
    </>
  );
}

function CardComponent({ imageSrc, heading, content, navigatePath }) {
  const navigate = useNavigate();
  return (
    <Card
    className="py-3"
      sx={{
        borderRadius: "5%",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",
      }}
    >
      <div
        className="flex  place-content-center "
        style={{ marginTop: "7vh" }}
      >
        {imageSrc === "1" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xmlSpace="preserve"
            width="100"
            height="100"
          >
            <text x="0" y="70" font-family="Arial" font-size="40" fill="#000">ADR</text>
          </svg>
        )}
        {imageSrc === "2" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xmlSpace="preserve"
            width="100"
            height="100"
          >
            <text x="0" y="70" font-family="Arial" font-size="40" fill="#000">AKB</text>
          </svg>
        )}
      </div>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
        >
          {heading}
        </Typography>
        <Typography
          className="px-6"
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
