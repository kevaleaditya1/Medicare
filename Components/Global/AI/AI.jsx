import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import '@fortawesome/fontawesome-free/css/all.min.css';
import sendbtn from "./sendbtn.svg"; // Correct path to your SVG file
import ReactMarkdown from "react-markdown";

// INTERNAL IMPORT
import { ASK_AI_CHAT } from "../../../Context/constants";
import {
  BsSendFill, // Keep this
  FaUserAlt,
  BsRobot,
  FaRegCopy,
} from "../../ReactICON/index";

const AI = () => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [chatArray, setChatArray] = useState([]);
  const [update, setUpdate] = useState(null);
  const [prompt, setPrompt] = useState();
  const [loader, setLoader] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    const AI_ASK_HISTORY = JSON.parse(localStorage.getItem("AI_ASK_HISTORY")) || [];
    setChatArray(AI_ASK_HISTORY);
    console.log(AI_ASK_HISTORY);
  }, [update]);

  const CALLING_AI = async () => {
    try {
      setLoader(true);
      setPrompt("");

      const response = await ASK_AI_CHAT(prompt); // Simulate API call
      if (response) {
        const newChat = {
          message: prompt, // User's message
          prompt: response, // AI's response
        };

        // Update chatArray and save to localStorage
        const updatedChatArray = [...chatArray, newChat];
        setChatArray(updatedChatArray);
        localStorage.setItem("AI_ASK_HISTORY", JSON.stringify(updatedChatArray));

        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setErrorMsg(error.message);
      notifyError(error.message);
      console.log(error);
    }
  };

  const copyResponse = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied successfully");
  };

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">ASK </a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">TeamHPower AI</a>
          </li>
        </ol>
      </div>
      {/* row */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div>
                  <div className="d-flex align-items-center">
                    <h4 className="card-title d-sm-none d-block">Ask AI</h4>
                  </div>

                  <div
                    style={{
                      height: "23rem", // Increased height
                      width: "100%",
                      marginBottom: "1rem",
                      border: "2px solid #EDF0F1",
                      borderRadius: "5px",
                      overflowY: "auto",
                      padding: "1rem",
                      backgroundColor: isLightMode ? "#f9f9f9" : "#1F1E26", // Light or dark background
                    }}
                  >
                    {chatArray?.map((chat, index) => (
                      <div key={index} style={{ marginBottom: "1rem" }}>
                        {/* User Message */}
                        {chat?.message && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end", // Align user messages to the right
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: isLightMode ? "#007bff" : "#444", // Light or dark bubble
                                color: "#fff",
                                padding: "0.75rem",
                                borderRadius: "15px",
                                maxWidth: "70%",
                                wordWrap: "break-word",
                              }}
                            >
                              {chat?.message}
                            </div>
                            <small style={{ color: isLightMode ? "#555" : "#aaa", marginTop: "0.25rem" }}>
                              <FaRegCopy onClick={() => copyResponse(chat?.message)} style={{ cursor: "pointer" }} />
                            </small>
                          </div>
                        )}

                        {/* AI Response */}
                        {chat?.prompt && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start", // Align AI responses to the left
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: isLightMode ? "#e0e0e0" : "#2c2c2c", // Light or dark bubble
                                color: isLightMode ? "#000" : "#fff",
                                padding: "0.75rem",
                                borderRadius: "15px",
                                maxWidth: "70%",
                                wordWrap: "break-word",
                              }}
                            >
                              {/* Render Markdown Content with Custom Styles */}
                              <ReactMarkdown
                                components={{
                                  h1: ({ node, ...props }) => (
                                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0.5rem 0" }} {...props} />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: "0.5rem 0" }} {...props} />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0.5rem 0" }} {...props} />
                                  ),
                                  p: ({ node, ...props }) => (
                                    <p style={{ fontSize: "1rem", margin: "0.5rem 0" }} {...props} />
                                  ),
                                  ol: ({ node, ...props }) => (
                                    <ol style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }} {...props} />
                                  ),
                                  ul: ({ node, ...props }) => (
                                    <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }} {...props} />
                                  ),
                                  li: ({ node, ...props }) => (
                                    <li style={{ marginBottom: "0.25rem" }} {...props} />
                                  ),
                                }}
                              >
                                {chat?.prompt}
                              </ReactMarkdown>
                            </div>
                            <small style={{ color: isLightMode ? "#555" : "#aaa", marginTop: "0.25rem" }}>
                              <FaRegCopy onClick={() => copyResponse(chat?.prompt)} style={{ cursor: "pointer" }} />
                            </small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input Area with Additional Features */}
                  <div
                    className="input-area"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor:"#17161E",
                      borderRadius: "40px",
                      padding: "0.5rem 1rem",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0)",
                      marginTop: "1rem",
                    }}
                  >
                    {/* Add Button with Upload Options */}
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-secondary"
                        style={{
                          backgroundColor: "#1F1E26",
                          border: "none",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "0.5rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to the text area
                          setShowUploadOptions(!showUploadOptions); // Toggle options
                        }}
                      >
                        <i
                          className="fa fa-plus"
                          style={{ color: "#fff", fontSize: "16px" }}
                        ></i>
                      </button>

                      {/* Upload Options Dropdown */}
                      {showUploadOptions && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "40px", // Position above the button
                            left: "0",
                            backgroundColor: "#1F1E26", // Matches the screen background
                            border: "1px solid #444", // Subtle border for separation
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Slight shadow for depth
                            zIndex: 1000,
                            padding: "0.5rem",
                            minWidth: "150px",
                          }}
                        >
                          <button
                            className="btn btn-dark btn-sm"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              marginBottom: "0.5rem",
                              backgroundColor: "#1F1E264", // Matches dropdown background
                              color: "#fff", // Conditional text color
                              border: "none",
                              borderRadius: "5px",
                              padding: "0.5rem",
                              textAlign: "left",
                              fontSize: "12px", // Smaller font size
                            }}
                            onClick={() =>
                              document.getElementById("image-upload").click()
                            }
                          >
                            <i
                              className="fa fa-image"
                              style={{
                                marginRight: "0.5rem",
                                fontSize: "14px",
                                color: isLightMode ? "#fff" : "#1F1E26", // Conditional icon color
                              }}
                            ></i>
                            Upload Image
                          </button>
                          <button
                            className="btn btn-dark btn-sm"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              backgroundColor: "#444", // Matches dropdown background
                              color: "#fff", // Conditional text color
                              border: "none",
                              borderRadius: "5px",
                              padding: "0.5rem",
                              textAlign: "left",
                              fontSize: "10px", // Smaller font size
                            }}
                            onClick={() =>
                              document.getElementById("document-upload").click()
                            }
                          >
                            <i
                              className="fa fa-file-alt"
                              style={{
                                marginRight: "0.5rem",
                                fontSize: "14px",
                                color: isLightMode ? "#fff" : "#1F1E26", // Conditional icon color
                              }}
                            ></i>
                            Upload Document
                          </button>

                          {/* Hidden Inputs for File Upload */}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              console.log("Image Uploaded:", e.target.files[0])
                            }
                          />
                          <input
                            id="document-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              console.log("Document Uploaded:", e.target.files[0])
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Text Input */}
                    <input
                      type="text"
                      placeholder="Ask anything"
                      style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#fff",
                        outline: "none",
                        fontSize: "16px",
                      }}
                      onFocus={() => setShowUploadOptions(false)} // Close dropdown on focus
                      onChange={(e) => setPrompt(e.target.value)}
                      value={prompt}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && prompt) {
                          CALLING_AI(); // Call the function to send the message
                        }
                      }}
                    />

                    {/* Additional Buttons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {/* Voice Input Button */}
                      <button
                        className="btn btn-secondary"
                        style={{
                          backgroundColor: "#3a3a3a",
                          border: "none",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fa fa-microphone"
                          style={{ color: "#fff", fontSize: "16px" }}
                        ></i>
                      </button>

                      {/* Send Button */}
                      <button
                        className="btn btn-primary"
                        style={{
                          backgroundColor: "#007bff",
                          border: "none",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => CALLING_AI(prompt)}
                        disabled={!prompt}
                      >
                        <img
                          src="https://img.icons8.com/?size=100&id=59854&format=png&color=000000"
                          alt="Send"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="additional-features mt-3">
                    <div className="d-flex justify-content-between">
                      {/* Clear Chat Button */}
                      <button
                        className="btn btn-danger btn-sl-sm"
                        type="button"
                        onClick={() => {
                          setChatArray([]); // Clear the chatArray state
                          localStorage.removeItem("AI_ASK_HISTORY"); // Remove chat history from localStorage
                          console.log("Chat history cleared");
                        }}
                      >
                        Clear Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;