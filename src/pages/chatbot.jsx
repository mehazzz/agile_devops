import { useState } from "react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Color palette
    const primaryBlue = "#244A65";
    const accentBrown = "#9E5A4A";
    const darkBrown = "#75352C";
    const lightGray = "#D3D6DA";

    return (
        <div>
            {/* Floating Chatbot Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "32px",
                        right: "32px",
                        backgroundColor: primaryBlue,
                        color: lightGray,
                        padding: "18px 28px",
                        borderRadius: "50px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                        fontWeight: "bold",
                        boxShadow: `0 4px 16px rgba(36, 74, 101, 0.22)`,
                        zIndex: 1000,
                        transition: "background 0.2s",
                    }}
                >
                    Chat Bot
                </button>
            )}

            {/* Chatbot Modal */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "40px",
                        right: "40px",
                        width: "400px",
                        height: "600px",
                        backgroundColor: lightGray,
                        boxShadow: "0px 8px 32px rgba(36, 74, 101, 0.25)",
                        borderRadius: "18px",
                        padding: "0",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1001,
                        border: `3px solid ${primaryBlue}`,
                    }}
                >
                    {/* Header with close button */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: primaryBlue,
                            color: lightGray,
                            borderTopLeftRadius: "15px",
                            borderTopRightRadius: "15px",
                            padding: "16px 20px",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Chatbot
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: accentBrown,
                                color: lightGray,
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "12px",
                                transition: "background 0.2s",
                            }}
                            aria-label="Close Chat"
                        >
                            ×
                        </button>
                    </div>
                    {/* Chatbase Iframe */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <iframe
                            src="https://www.chatbase.co/chatbot-iframe/7SvAMymI0-18JvnHs6N8A"
                            title="Chatbot"
                            width="100%"
                            height="100%"
                            style={{
                                border: "none",
                                borderBottomLeftRadius: "15px",
                                borderBottomRightRadius: "15px",
                                minHeight: "0",
                                height: "100%",
                                background: "#fff"
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
