---
{
	title: "Networking 101: UDP",
	description: 'An introduction to the User Datagram Protocol, the simplest method of communicating over a network',
	published: '2019-09-26T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['udp', 'networking'],
	attached: [],
	license: 'cc-by-nc-sa-4',
	series: "networking-101",
	order: 2
}
---

Networking is the foundation that all interactions of the internet are built upon. Every chat you send, every website you visit, every interaction that is shared with another digitially is built upon the same fundamentals. These fundamentals layout and explain how computers are able to communicate with one-another and how they interlink with one-another in order to provide you with the experience you've come to know and love with the internet.

In this series, we'll go through what these fundamentals are, how they're used and composed to makeup the communications you utilize on a day-to-day basis.

Let's start where most things tend to: The most simple to start with.

Let's start with **UDP**.

# UDP {#udp}

UDP is the **"User Datagram Protocol"**. Of the acronym, you may be familiar with "User" and "Protocol", but the term **"datagram"** may be new. 

If you're familiar with how a telegram (like the old-school messaging method, not the new-age messaging platform) used to work, you may already be familiar with how a datagram works.

_A datagram is a uni-directional, non-verifably-sent peice of communication that contains data._

Whoa. What's that even mean?

Okay, let's take a step back and understand what's going on with a datagram. Let's imagine you want to send a letter with some information to a friend in another state. Using the postal service, you're unable to verify that your friend has recieved the letter, only wait for a reply. There's also interaction required in order to send a letter. So long as you know the address of your friend, you can send as many letters as you'd like.

In a typical correspondance, you'd send off a letter, include a return address, and wait for a response back. That said, there's nothing stopping someone from sending more than a single letter before recieving a response. This chart is a good example of that:

![An image showcasing the rules of data sending both ways](./image-of-unidirectional-data-being-sent.svg)

Similarly, a datagram is sent from a single sender, recieved by a single recipient, addressed where to go, and contains a set of information.

However, one of the biggest weakness of a datagram is that you have no guarantee that what you sent was delivered. Because of this, other methods of sending data have been created in order to have assurance of data being received.

That said, just because you're unsure whether or not it was sent does not mean that it's a useless delivery method. After all, we still utilize the postal service for various aspects of foundational infrastructure, despite similar flaws. For example, due to UDP's relatively short time-to-send (as compared to other methods we'll cover later), UDP is often used as the primary method for streaming data live.

# IP Addresses and Packets {#ip-addresses-and-packets}

_With a datagram, you send a group of data to another client that you know the address of_. This address is known as an **"IP Address"**. This address is composed of numbers (and sometimes letters) _in order to tell your computer where the other is_.

![An image showing a "letter" (packet) going to an IPv4 address of 149.32.206.25 in a collection of machines with different IP addresses](./showing-an-ip-address.svg)

The group of data that is sent using a datagram is known as a **"packet"**. This packet contains both a header and a body.

![A breakdown of a packet showing a combination of a header with metadata and a body with data for the client](./breakdown-of-a-packet.svg)

These headers can contain information (also called "metadata") like what size the content is, what type of data format the body of the packet contains, and more. This information can be then used to route specific packets to various routes. For example, say that I send a packet of data to a server that has the type 

`video: title: "A simulation of a packet that has a header stating the body to be in XML format being routed to a server that specifically handles XML files and a packet with a header that notes the data being in JSON being routed to a server that handles JSON": ./redirect-based-on-headers.mp4`

## Different Types of IP Addresses {#ipv4-vs-ipv6}

While IP addresses may seem somewhat arbitrary on first glance, there are important rules to abide to in order to have what's considered a "valid" IP address. What's considered "valid" is defined by the TCP/IP specification, which is lead by the [Internet Engineering Task Force](https://en.wikipedia.org/wiki/Internet_Engineering_Task_Force), a group created specifically to manage and handle network protocaul standardization. As time has gone on, there have been various revisions to the IP validation methods. What was once valid is now considered antiquated and migrated to a newer standard of IP address. The two most commonly used standards for defining IP addresses today are:

- IPv4 (Internet Protocol version 4)
- IPv6 (Internet Protocol version 6)

Due to the explosion of internet enabled-devices, we have had to make changes to the way we assign network addresses. The previous version of the IP protocol (v4) allowed for 4,294,967,296 (2^32) unique IP addresses. While this number may seem exorbant, it's important to realize that we ran out of unique IP addresses in 2017. The only reason why we even lasted that long is due to a myriad of techniques that networking companies (like your ISP) utilized to extend the life of the IPv4 protocol. With IPv6, we're able to have 340,282,366,920,938,463,463,374,607,431,768,211,456 (2^128) (yes, that's correct) unique addresses - no fear of immediate exhaustion of addresses.

![A showcase of an example IPv4 address and an IPv6 address. IPv4 example is "131.198.246.34" while IPv6 is "4131:e0fd:ef8e:ed27:f5b:ac98:640c:bfa5"](./ip-comparison.svg)

### What Happened to version 5? {#ipv5}

As mentioned previously, the Internet Engineering Task Force manages various specifications regarding the standardization of internet communication. Back in 1995, they gathered to attempt to create a new version of the protocol to handle the growing use of live-streamed communication. To make a long story short, this version was abandoned for various reasons and they moved on to tackle the issue of unique identifiers rapidly diminishing. In order to avoid confusion with the attempted streaming protocol improvements, this new version was called IPv6.

> If you'd like to read more about this version for fun, you can read through [the Wikipedia page](https://en.wikipedia.org/wiki/Internet_Stream_Protocol). Unfortunately, there's limited information and things get very quickly highly technical, due to the "in progress" nature that things were left at.

# Ports {#udp-ports}

Continuing on with the mail analogy; just like an apartment complex can have a single mailbox for multiple apartments living within the same building, so too can a single machine have multiple landing sites for network packets.

This method of seperating out locations for different network packets are called **"ports"**. A single machine may choose to open a myriad of ports ranging anywhere from `0` to `65,535`. Any one of these ports is able to recieve a different stream of information in-bound and out-bound alike.

This method of port address selection even has it's own shorthand. For example, if you wanted to send data to IP address `192.168.1.50` on port `3000`, you'd send that code to: `192.168.1.50:3000`, being sure to use a colon to deliniate between the IP address and the port number.

That said, UDP does not require you specify a port, you're able to pass port `0` to have the server dynamically decide the port used to communicate, if it does have a preference.

## Pre-Assigned Ports {#standard-ports}

Like an apartment complex may pre-assign individuals to specific rooms, so too does the specification for Internet Protocol pre-assign specific applications to specific ports. For example, port `21` is officially designated to the [File Transfer Protocol (FTP)](https://en.wikipedia.org/wiki/File_Transfer_Protocol), which can used to transfer files if a server is setup on a machine to handle this protocol. As a result, it's strongly discouraged to use these ports that are reserved for your application stack if you want to use a specific port for networking in your app or project.

# Conclusion

This has been a breif overview of UDP. In this series, we're hoping to introduce the fundamentals of networking, and while UDP is not often seen in higher-level coding directly, it's usage is integral to understand many other aspects of networking. In the next article in the series, we'll introduce TCP and how you're able to verify that your messages are being sent to the other client. Even further into the series, we'll explain how IP addresses are assigned by using UDP thanks to DHCP.

To make sure you don't miss any of these articles, you may want to subscribe to our newsletter. We promise not to spam you with unrelated stuff and keep emails to a minimal. Otherwise, we also have a Discord you can join that we'll share new articles with. We also help others learn in the Discord as well.
