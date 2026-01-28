---
{
title: "How to Speak the Language of the Internet: A Introduction to the Most Common Network Protocols",
published: "2024-01-03T09:55:00Z",
edited: "2023-12-27T09:56:16Z",
tags: ["networking", "network", "protocols"],
description: "Network protocols are sets of rules and standards that enable communication between devices over a...",
originalLink: "https://dev.to/this-is-learning/how-to-speak-the-language-of-the-internet-a-guide-to-the-most-common-network-protocols-j8e",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Network protocols are sets of rules and standards that enable communication between devices over a network. They define how data is formatted, transmitted, and received, as well as how errors are detected and corrected. There are many different types of network protocols, each with its own advantages and disadvantages.

In this article, we will explore some of the most common network protocols and how they work.

## HTTP

HTTP stands for **Hypertext Transfer Protocol**. It is the foundation of the World Wide Web, as it allows web browsers and servers to exchange information. HTTP is a **request-response** protocol, which means that a client (such as a browser) sends a request to a server (such as a web server), and the server responds with the requested data (such as a web page). HTTP is a **stateless** protocol, which means that each request and response are independent and do not keep track of previous interactions. HTTP uses **TCP** (Transmission Control Protocol) as the underlying transport protocol, which ensures reliable and ordered delivery of data.

Some examples of HTTP requests and responses are:

- A browser requests a web page from a server by sending an HTTP GET request with the URL of the page. The server responds with an HTTP OK response and the HTML content of the page.
- A browser submits a form to a server by sending an HTTP POST request with the data of the form. The server responds with an HTTP OK response and a confirmation message.
- A browser requests an image from a server by sending an HTTP GET request with the URL of the image. The server responds with an HTTP OK response and the binary data of the image.

## HTTP/3 (QUIC)

HTTP/3 is the latest version of HTTP, which is based on **QUIC** (Quick UDP Internet Connections). QUIC is a new transport protocol that uses **UDP** (User Datagram Protocol) instead of TCP. UDP is a **connectionless** and **unreliable** protocol, which means that it does not establish a connection between the sender and the receiver, and does not guarantee the delivery or order of the data. However, QUIC adds features such as **encryption**, **congestion control**, **error correction**, and **multiplexing** to UDP, making it more secure, efficient, and robust than TCP. HTTP/3 uses QUIC to overcome some of the limitations of HTTP over TCP, such as **head-of-line blocking**, **TCP handshake latency**, and **TCP port blocking**.

Some examples of HTTP/3 requests and responses are:

- A browser requests a web page from a server by sending an HTTP/3 GET request with the URL of the page over a QUIC connection. The server responds with an HTTP/3 OK response and the HTML content of the page over the same QUIC connection.
- A browser requests multiple resources (such as images, scripts, and stylesheets) from a server by sending multiple HTTP/3 GET requests over a single QUIC connection. The server responds with multiple HTTP/3 OK responses and the binary data of the resources over the same QUIC connection, without blocking each other.
- A browser requests a web page from a server by sending an HTTP/3 GET request over a QUIC connection that is encrypted and authenticated. The server responds with an HTTP/3 OK response and the HTML content of the page over the same QUIC connection, without requiring a separate TLS (Transport Layer Security) handshake.

## HTTPS

HTTPS stands for **Hypertext Transfer Protocol Secure**. It is a secure version of HTTP, which uses **TLS** (Transport Layer Security) or **SSL** (Secure Sockets Layer) to encrypt and authenticate the data exchanged between the client and the server. HTTPS protects the data from being intercepted, modified, or spoofed by third parties, such as hackers, ISPs, or governments. HTTPS is widely used for websites that handle sensitive information, such as online banking, e-commerce, or social media. HTTPS uses **TCP** as the underlying transport protocol, which ensures reliable and ordered delivery of data.

Some examples of HTTPS requests and responses are:

- A browser requests a web page from a server by sending an HTTPS GET request with the URL of the page over a TCP connection that is encrypted and authenticated by TLS. The server responds with an HTTPS OK response and the HTML content of the page over the same TCP connection.
- A browser submits a form to a server by sending an HTTPS POST request with the data of the form over a TCP connection that is encrypted and authenticated by TLS. The server responds with an HTTPS OK response and a confirmation message over the same TCP connection.
- A browser requests an image from a server by sending an HTTPS GET request with the URL of the image over a TCP connection that is encrypted and authenticated by TLS. The server responds with an HTTPS OK response and the binary data of the image over the same TCP connection.

## WebSocket

WebSocket is a protocol that enables **bidirectional** and **persistent** communication between a client and a server over a single TCP connection. WebSocket is different from HTTP, which is **unidirectional** and **transient**, meaning that the client initiates the communication and the server closes the connection after each request and response. WebSocket allows the client and the server to send and receive data at any time, without the overhead of HTTP headers and TCP handshakes. WebSocket is suitable for applications that require real-time and interactive communication, such as online games, chat, or video streaming. WebSocket uses **TCP** as the underlying transport protocol, which ensures reliable and ordered delivery of data.

Some examples of WebSocket communication are:

- A browser establishes a WebSocket connection with a server by sending an HTTP GET request with an **Upgrade** header that indicates the WebSocket protocol. The server responds with an HTTP OK response with a **Sec-WebSocket-Accept** header that confirms the WebSocket connection.
- A browser sends a message to a server over the WebSocket connection by sending a WebSocket frame with the text data of the message. The server receives the WebSocket frame and sends a WebSocket frame with the text data of the reply over the same WebSocket connection.
- A browser receives a notification from a server over the WebSocket connection by receiving a WebSocket frame with the text data of the notification. The browser displays the notification to the user and sends a WebSocket frame with the text data of the acknowledgment over the same WebSocket connection.

## TCP

TCP stands for **Transmission Control Protocol**. It is one of the core protocols of the Internet, which provides a **reliable**, **ordered**, and **error-free** delivery of data between two devices. TCP establishes a **connection** between the sender and the receiver, and divides the data into **segments** that are numbered and acknowledged. TCP uses mechanisms such as **sequence numbers**, **acknowledgments**, **retransmissions**, **checksums**, and **congestion control** to ensure that the data is delivered correctly and efficiently. TCP is used by many application layer protocols, such as HTTP, HTTPS, FTP, SMTP, and SSH.

Some examples of TCP communication are:

- A device establishes a TCP connection with another device by sending a TCP segment with the **SYN** flag set, which indicates a connection request. The other device responds with a TCP segment with the **SYN** and **ACK** flags set, which indicates a connection acceptance and acknowledgment. The first device responds with a TCP segment with the **ACK** flag set, which indicates a final acknowledgment. This process is called the **three-way handshake**.
- A device sends data to another device over the TCP connection by sending TCP segments with the data and the sequence numbers. The other device receives the TCP segments and sends TCP segments with the acknowledgments and the acknowledgment numbers. If a TCP segment is lost or corrupted, the sender retransmits the TCP segment after a timeout or a duplicate acknowledgment. This process is called the **reliable data transfer**.
- A device closes a TCP connection with another device by sending a TCP segment with the **FIN** flag set, which indicates a connection termination. The other device responds with a TCP segment with the **ACK** flag set, which indicates an acknowledgment. The other device also sends a TCP segment with the **FIN** flag set, which indicates a connection termination. The first device responds with a TCP segment with the **ACK** flag set, which indicates an acknowledgment. This process is called the **four-way handshake**.

## UDP

UDP stands for **User Datagram Protocol**. It is another core protocol of the Internet, which provides a **simple**, **fast**, and **low-overhead** delivery of data between two devices. UDP does not establish a connection between the sender and the receiver, and does not divide the data into segments. UDP simply sends and receives **datagrams**, which are packets of data with a source and a destination address. UDP does not use any mechanisms to ensure the reliability, order, or error-free delivery of the data. UDP is used by applications that do not require these guarantees, but prefer speed and efficiency, such as video streaming, online gaming, or voice over IP. UDP is also used by some application layer protocols, such as DNS, DHCP, and SNMP.

Some examples of UDP communication are:

- A device sends data to another device by sending a UDP datagram with the data and the source and destination addresses. The other device receives the UDP datagram and processes the data. There is no acknowledgment or feedback from the receiver to the sender.
- A device sends a DNS query to a DNS server by sending a UDP datagram with the query and the source and destination addresses. The DNS server receives the UDP datagram and sends a UDP datagram with the answer and the source and destination addresses. The device receives the UDP datagram and processes the answer.
- A device sends a video stream to another device by sending multiple UDP datagrams with the video frames

## SMTP

SMTP stands for **Simple Mail Transfer Protocol**. It is the standard protocol for sending and receiving **email** messages over the Internet. SMTP is a **client-server** protocol, which means that there are two types of agents involved in the email communication: **mail user agents (MUAs)** and **mail transfer agents (MTAs)**. MUAs are applications that allow users to compose, send, and read email messages, such as Outlook, Gmail, or Thunderbird. MTAs are servers that relay email messages from one MUA to another, or from one MTA to another, until they reach the final destination. SMTP uses **TCP** as the underlying transport protocol, which ensures reliable and ordered delivery of data.

Some examples of SMTP communication are:

- A user sends an email message to another user by using an MUA to compose the message and specify the sender and the recipient addresses. The MUA connects to the MTA of the sender's domain (such as smtp.example.com) and sends the message using the SMTP commands: **HELO**, **MAIL FROM**, **RCPT TO**, **DATA**, and **QUIT**. The MTA of the sender's domain accepts the message and forwards it to the MTA of the recipient's domain (such as smtp.example.net) using the same SMTP commands. The MTA of the recipient's domain accepts the message and stores it in the mailbox of the recipient. The recipient can then use an MUA to retrieve the message from the mailbox using another protocol, such as POP3 or IMAP.
- A user receives an email message from another user by using an MUA to connect to the MTA of the user's domain (such as imap.example.com) and request the message using another protocol, such as POP3 or IMAP. The MTA of the user's domain sends the message to the MUA using the POP3 or IMAP commands. The MUA displays the message to the user and allows the user to reply, forward, or delete the message.

## FTP

FTP stands for **File Transfer Protocol**. It is a protocol that allows users to transfer files between two devices over a network. FTP is a **client-server** protocol, which means that there are two types of agents involved in the file transfer: **FTP clients** and **FTP servers**. FTP clients are applications that allow users to initiate and control the file transfer, such as FileZilla, WinSCP, or Command Prompt. FTP servers are servers that store the files and respond to the requests from the FTP clients, such as Apache, IIS, or ProFTPD. FTP uses **TCP** as the underlying transport protocol, which ensures reliable and ordered delivery of data.

Some examples of FTP communication are:

- A user uploads a file to a server by using an FTP client to connect to the FTP server using the server's address (such as ftp.example.com) and the user's credentials (such as username and password). The FTP client sends the FTP commands: **USER**, **PASS**, **CWD**, **PASV**, **STOR**, and **QUIT**. The FTP server responds with the FTP replies: **220**, **331**, **230**, **250**, **227**, **150**, **226**, and **221**. The FTP client and the FTP server establish a **data connection** and transfer the file using the **binary** or **ASCII** mode.
- A user downloads a file from a server by using an FTP client to connect to the FTP server using the server's address and the user's credentials. The FTP client sends the FTP commands: **USER**, **PASS**, **CWD**, **PASV**, **RETR**, and **QUIT**. The FTP server responds with the FTP replies: **220**, **331**, **230**, **250**, **227**, **150**, **226**, and **221**. The FTP client and the FTP server establish a data connection and transfer the file using the binary or ASCII mode.

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
