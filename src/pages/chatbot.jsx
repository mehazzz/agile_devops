import { useEffect, useState } from "react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.innerHTML = `
          
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="7SvAMymI0-18JvnHs6N8A";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();

        `;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            {/* Floating Chatbot Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{
                    position: "fixed", bottom: "20px", right: "20px",
                    backgroundColor: "#007bff", color: "white",
                    padding: "12px 18px", borderRadius: "50px",
                    border: "none", cursor: "pointer", fontSize: "16px"
                }}
            >
                {isOpen ? "Close Chat" : "Chat with Us"}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div 
                    id="chatbot-container" 
                    style={{
                        position: "fixed", bottom: "80px", right: "20px",
                        width: "350px", height: "500px",
                        backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px", padding: "10px"
                    }}
                >
                    <iframe
    src="https://www.chatbase.co/chatbot-iframe/7SvAMymI0-18JvnHs6N8A"
    width="100%"
    style="height: 100%; min-height: 700px"
    frameborder="0"
></iframe>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
